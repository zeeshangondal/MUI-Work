import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core';
import { useForm, Form } from '../../components/useForm';
import * as requisitionService from "../../services/requisitionService";
import * as itemService from "../../services/itemService";

import useTable from '../../components/useTable';
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';


import Controls from "../../components/controls/Controls";
import { EditOutlined, Search } from "@material-ui/icons";
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

import SendOutlinedIcon from '@material-ui/icons/SendOutlined';
import Items from './Items';
import Notification from '../../components/Notification';
import Popup from '../../components/Popup';
import ConfirmDialog from '../../components/ConfirmDialog';



const initialFValues = {
    id: 0,
    name: '', designation: '', departmentId: '',
    requestedDate: new Date(),
    verifiedByName: '', verifiedDate: new Date(),
    receivedByName: '', receivedDate: new Date(),
    issuedByName: '', issuedDate: new Date()
}

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

const addedItemsHeadCells = [
    { id: 'name', label: 'Name' },
    { id: 'category', label: 'Category' },
    { id: 'quantity', label: 'Available Quantity', disableSorting: true },
    { id: 'actions', label: 'Actions', disableSorting: true }
]


export default function RequisitionForm(props) {
    const classes = useStyles()

    const { addOrEdit, recordForEdit } = props;
    const [addedItems, setAddedItems] = React.useState([])
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [openPopup, setOpenPopup] = useState(false)
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })

    React.useEffect(() => {
        if (recordForEdit != null) {
            setValues({
                ...recordForEdit
            })
            setAddedItems([
                ...recordForEdit.items
            ])
        }
    }, [recordForEdit])


    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('name' in fieldValues)
            temp.name = fieldValues.name ? "" : "Name is required."
        if ('designation' in fieldValues)
            temp.designation = fieldValues.designation ? "" : "Designation is required."

        // if ('email' in fieldValues)
        //     temp.email = (/$^|.+@.+..+/).test(fieldValues.email) ? "" : "Email is not valid."
        if ('departmentId' in fieldValues)
            temp.departmentId = fieldValues.departmentId.length != 0 ? "" : "Department is required."
        if ('verifiedByName' in fieldValues)
            temp.verifiedByName = fieldValues.verifiedByName ? "" : "This field is required."
        if ('receivedByName' in fieldValues)
            temp.receivedByName = fieldValues.receivedByName ? "" : "This field is required."
        if ('issuedByName' in fieldValues)
            temp.issuedByName = fieldValues.issuedByName ? "" : "This field is required."
        // if ('mobile' in fieldValues)
        //     temp.mobile = fieldValues.mobile.length >= 11 ? "" : "11 numbers required."

        setErrors({
            ...temp
        })
        if (fieldValues = values)
            return Object.values(temp).every(x => x == "")
    }
    const {
        values,
        setValues,
        handleInputChange,
        errors,
        setErrors,
        resetForm
    } = useForm(initialFValues, true, validate);


    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(addedItems, addedItemsHeadCells, filterFn)

    const addItemToRequisition = (item) => {
        if (addedItems.find((it) => it.id == item.id)) {
            setNotify({
                isOpen: true,
                message: `${item.name} already been added `,
                type: 'error'
            })
            return
        }

        setAddedItems([
            ...addedItems,
            item
        ])
        setNotify({
            isOpen: true,
            message: `${item.quantity} ${item.name} Added Successfully`,
            type: 'success'
        })
    }
    const onRemoveItemFromRequisition = item => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        })
        setAddedItems(addedItems.filter(x => x.id != item.id))

        setNotify({
            isOpen: true,
            message: `${item.quantity} ${item.name} Removed Successfully`,
            type: 'error'
        })
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            const requisitionData={...values , items:addedItems}
            console.log(requisitionData)
            addOrEdit(requisitionData, resetForm)
        }
    }
    
    const resetRequisistionForm=()=>{
        resetForm()
        setAddedItems([])
    }
    const handleSearch = e => {
        let target = e.target;
        setFilterFn({
            fn: items => {
                if (target.value == "")
                    return items;
                else
                    return items.filter(x => x.name.toLowerCase().includes(target.value.toLowerCase()))
            }
        })
    }


    return (
        <>
            <Form>
                <Grid container>
                    <Grid item xs={12}>
                        <Controls.Input
                            name="name"
                            label="Name"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.name}
                        />

                        <Controls.Input
                            name="designation"
                            label="Designation"
                            value={values.designation}
                            onChange={handleInputChange}
                            error={errors.designation}
                        />
                        <Controls.Select
                            name="departmentId"
                            label="Department"
                            value={values.departmentId}
                            onChange={handleInputChange}
                            options={requisitionService.getDepartmentCollection()}
                            error={errors.departmentId}
                        />
                        <Controls.DatePicker
                            name="requestedDate"
                            label="Date"
                            value={values.requestedDate}
                            onChange={handleInputChange}
                        />

                    </Grid>
                </Grid>
                <br />

                <Popup
                    openPopup={openPopup}
                    title="Add Items to Requisition"
                    setOpenPopup={setOpenPopup}
                >
                    <Items
                        addItemToRequisition={addItemToRequisition}
                    />
                </Popup>
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
                        text="Add Items"
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => { setOpenPopup(true) }}
                    />
                </Toolbar>
                <TblContainer>
                    <TblHead />
                    <TableBody>
                        {
                            recordsAfterPagingAndSorting().map((item) => {
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.category}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>
                                            <Controls.ActionButton color='primary' >
                                                <EditOutlined />
                                            </Controls.ActionButton>

                                            <Controls.ActionButton color='secondary'
                                                onClick={() => {
                                                    console.log("clicked")
                                                    setConfirmDialog({
                                                        isOpen: true,
                                                        title: 'Are you sure to delete this item?',
                                                        subTitle: "You can't undo this operation",
                                                        onConfirm: () => { onRemoveItemFromRequisition(item) }
                                                    })
                                                }}
                                            >
                                                <CloseIcon />
                                            </Controls.ActionButton>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </TblContainer>
                <TblPagination />
                <Notification
                    notify={notify}
                    setNotify={setNotify}
                />
                <ConfirmDialog
                    confirmDialog={confirmDialog}
                    setConfirmDialog={setConfirmDialog}
                />
                <Grid container>
                    <Grid item xs={12}>
                        <Controls.Input
                            name="verifiedByName"
                            label="Verified By (HoD/ Section Head)"
                            value={values.verifiedByName}
                            onChange={handleInputChange}
                            error={errors.verifiedByName}
                        />
                        <Controls.DatePicker
                            name="verifiedDate"
                            label="Date"
                            value={values.verifiedDate}
                            onChange={handleInputChange}
                        />

                        <Controls.Input
                            name="receivedByName"
                            label="Received By"
                            value={values.receivedByName}
                            onChange={handleInputChange}
                            error={errors.receivedByName}
                        />
                        <Controls.DatePicker
                            name="receivedDate"
                            label="Date"
                            value={values.receivedDate}
                            onChange={handleInputChange}
                        />


                        <Controls.Input
                            name="issuedByName"
                            label="Issued By (Store in charge)"
                            value={values.issuedByName}
                            onChange={handleInputChange}
                            error={errors.issuedByName}

                        />
                        <Controls.DatePicker
                            name="issuedDate"
                            label="Date"
                            value={values.issuedDate}
                            onChange={handleInputChange}
                        />
                        <Controls.Button
                            text="Submit"
                            variant="contained"
                            onClick={handleSubmit}
                        />
                        <Controls.Button
                            text="Reset"
                            variant="contained"
                            color="secondary"
                            onClick={resetRequisistionForm}
                        />
                    </Grid>
                </Grid>
            </Form>
            <Notification
                notify={notify}
                setNotify={setNotify}
            />
        </>
    )
}




