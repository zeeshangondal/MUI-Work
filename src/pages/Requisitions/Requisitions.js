import React, { useState } from 'react'
import RequisitionForm from "./RequisitionForm";
import PageHeader from "../../components/PageHeader";
import PeopleOutlineTwoToneIcon from '@material-ui/icons/PeopleOutlineTwoTone';
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import useTable from "../../components/useTable";
import * as requisitionService from "../../services/requisitionService";


import Controls from "../../components/controls/Controls";
import { EditOutlined, Search } from "@material-ui/icons";
import AddIcon from '@material-ui/icons/Add';
import Popup from '../../components/Popup';
import CloseIcon from '@material-ui/icons/Close';
import Notification from '../../components/Notification';
import ConfirmDialog from '../../components/ConfirmDialog';





const headCells = [
  { id: 'name', label: 'Name' },
  { id: 'date', label: 'Date' },
  { id: 'department', label: 'Department', disableSorting: true },
  { id: 'actions', label: 'Actions', disableSorting: true },

]

const useStyles = makeStyles(theme => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3)
  },
  searchInput: {
    width: '75%'
  },
  newButton: {
    position: 'absolute',
    right: '10px'
  }
}))

export default function Requisitions() {
  const classes = useStyles()
  const [records, setRecords] = React.useState(requisitionService.getAllRequisitions())
  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
  const [openPopup, setOpenPopup] = useState(false)
  const [recordForEdit, setRecordForEdit] = useState(null)
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })


  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting
  } = useTable(records, headCells, filterFn)



  const handleSearch = e => {
    let target = e.target;
    setFilterFn({
      fn: items => {
        if (target.value == "")
          return items;
        else
          return items.filter(x => x.fullName.toLowerCase().includes(target.value))
      }
    })
  }


  const addOrEdit = (requisitionForm, resetForm) => {
    if (requisitionForm.id == '0')
      requisitionService.insertRequisition(requisitionForm)
    else
      requisitionService.updateRequisition(requisitionForm)
    setRecordForEdit(null)
    resetForm()
    setOpenPopup(false)
    setRecords(requisitionService.getAllRequisitions())
    setNotify({
      isOpen: true,
      message: 'Submitted successfully',
      type: 'success'
    })
  }
  const onDelete = (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    requisitionService.deleteRequisition(id)
    setRecords(requisitionService.getAllRequisitions())
    setNotify({
      isOpen: true,
      message: 'Deleted successfully',
      type: 'error'
    })
  }
  const openInPopup = (requisitionForm) => {
    setRecordForEdit(requisitionForm)
    setOpenPopup(true)
  }
  return (
    <div>
      <PageHeader
        title="Add Requisition"
        subTitle="Store Requisition Form design with validation"
        icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
      />
      <Paper className={classes.pageContent}>
        {/* <RequisitionForm /> */}
        <Toolbar>
          <Controls.Input
            className={classes.searchInput}
            label="Search"
            InputProps={{
              startAdornment: (<InputAdornment position="start">
                <Search />
              </InputAdornment>)
            }}
            onChange={handleSearch}
          />
          <Controls.Button
            className={classes.newButton}
            text="Add New"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => { setOpenPopup(true); setRecordForEdit(null) }}
          />
        </Toolbar>

        <TblContainer>
          <TblHead />
          <TableBody>
            {
              recordsAfterPagingAndSorting().map(requisitionForm => (
                <TableRow key={requisitionForm.id}>
                  <TableCell>{requisitionForm.name}</TableCell>
                  <TableCell>{requisitionForm.requestedDate}</TableCell>
                  <TableCell>{requisitionForm.department}</TableCell>
                  <TableCell>
                    <Controls.ActionButton color='primary' onClick={() => openInPopup(requisitionForm)}>
                      <EditOutlined />
                    </Controls.ActionButton>

                    <Controls.ActionButton color='secondary'
                      onClick={() => {
                        setConfirmDialog({
                          isOpen: true,
                          title: 'Are you sure to delete this record?',
                          subTitle: "You can't undo this operation",
                          onConfirm: () => { onDelete(requisitionForm.id) }
                        })
                      }}
                    >
                      <CloseIcon />
                    </Controls.ActionButton>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
      <Popup
        openPopup={openPopup}
        title="Employee Form"
        setOpenPopup={setOpenPopup}
      >
        <RequisitionForm addOrEdit={addOrEdit} recordForEdit={recordForEdit} />
      </Popup>
      <Notification
        notify={notify}
        setNotify={setNotify}
      />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </div>
  )
}
