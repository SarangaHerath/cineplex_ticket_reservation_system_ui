import * as React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { Button, Dialog, Grow, LinearProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { Delete, Edit, Update } from "@mui/icons-material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Sidebar } from "../../../component/sidebar/Sidebar";


function createData(reservationId,status, createdDate, noOfSeat, movieName, time,userName) {
  return {
    reservationId,
    status,
    createdDate,
    noOfSeat,
    movieName,
    time,
    userName
  };
}



function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "reservationId",
    numeric: false,
    disablePadding: false,
    label: "Reservation Id",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "createdDate",
    numeric: false,
    disablePadding: false,
    label: "Created Date",
  },
  {
    id: "noOfSeat",
    numeric: false,
    disablePadding: false,
    label: "No Of Seat",
  },
  {
    id: "movieName",
    numeric: false,
    disablePadding: false,
    label: "Movie Name",
  },
  {
    id: "time",
    numeric: false,
    disablePadding: false,
    label: "Show Time",
  },
  {
    id: "userName",
    numeric: false,
    disablePadding: false,
    label: "User Name",
  },
  {
    id: "action",
    numeric: false,
    disablePadding: false,
    label: "Actions",
  },
];


function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
         Movie List
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};
export const ReservationList = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("unitPrice");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);
  const authToken = localStorage.getItem('auth_token');
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/reservation/getAll",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const responseData = response.data.data; // Access the 'data' property in the response
        console.log(responseData);
  
        const newRows = responseData.map((data) =>
          createData(
            data.reservationId,
            data.status,
            data.createdDate,
            data.noOfSeat,
            data.responseMovieDto.movieName,
            data.responseShowTimeDto.time,
            data.responseUserDto.userName
          )
        );
        console.log(newRows);
        setRows(newRows);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [authToken]);
  

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleDelete = async (id) => {
    try {
      // Send DELETE request to the API endpoint
      await axios.delete(`http://localhost:8080/api/v1/reservation/cancel/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
      );
  console.log(id)
      // Update the state to reflect the changes (remove the deleted row)
      const updatedRows = rows.filter((row) => row.movieId !== id);
      setRows(updatedRows);
  
      // Clear the selected items
      setSelected([]);
      toast.success("Movie deleted successfully");
      setTimeout(() => {
       window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error(`Warning! Can't delete – this movie is part of a showtime`);
      setTimeout(() => {
       window.location.reload();
      }, 2500);
    }
  };
  
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;
  const [open, setOpen] = React.useState(false);
  const [openedit, setOpenEdit] = React.useState(false);
  const [selectedMovie, setselectedMovie] = React.useState(null);


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddProduct = async () => {
    // Add logic to handle adding a product
    // ...
    // After adding the product, close the modal
    handleClose();
  };

  const handleOpenEdit = (row) => {
    setselectedMovie(row);
    setOpenEdit(true);
  };
 
  const handleEditClose = () => {
    setOpenEdit(false);
  };
  return (
    <Sidebar>
    <Box sx={{}}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      ><ToastContainer />
       
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Grow}
        transitionDuration={500}
      >
       {/* <AddMovie></AddMovie> */}
      </Dialog>
      <Dialog
        open={openedit}
        onClose={handleEditClose}
        TransitionComponent={Grow}
        transitionDuration={500}
      >
        
       {/* <EditMovie id={selectedMovie ? selectedMovie.movieId : null} onClose={handleEditClose} /> */}
      </Dialog>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        {rows.length > 0 ? (
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={"small"}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    const uniqueKey = `row-${row.id}`;
                    return (
                      <TableRow
                        hover
                      
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={uniqueKey}
                        selected={isItemSelected}
                        sx={{ cursor: "pointer" }}
                      >
                      

                      <TableCell align="left">{row.reservationId}</TableCell>
                      <TableCell align="left">{row.status}</TableCell>
                      <TableCell align="left">{row.createdDate}</TableCell>
                      <TableCell align="left">{row.noOfSeat}</TableCell>
                      <TableCell align="left">{row.movieName}</TableCell>
                      <TableCell align="left">{row.time}</TableCell>
                      <TableCell align="left">{row.userName}</TableCell>
                      
                          <TableCell align="left">
                          
                            <IconButton
                              aria-label="Delete"
                              onClick={() => handleDelete(row.reservationId)}
                              sx={{color:'#E74C3C'}}
                            >
                              <Delete />
                            </IconButton>
                            
                          </TableCell>
                     
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <LinearProgress />
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </Box>
    </Sidebar>
  );
};
