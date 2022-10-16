import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core';
import { useForm, Form } from '../../components/useForm';
import * as employeeService from "../../services/employeeService";
import * as requisitionService from "../../services/requisitionService";
import * as itemService from "../../services/itemService";

import useTable from '../../components/useTable';
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';


import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import AddIcon from '@material-ui/icons/Add';

import SendOutlinedIcon from '@material-ui/icons/SendOutlined';
import Popup from '../../components/Popup';



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

const allItemsHeadCells = [
    { id: 'name', label: 'Name' },
    { id: 'category', label: 'Category' },
    { id: 'quantity', label: 'Available Quantity', disableSorting: true },
    { id: 'actions', label: 'Actions', disableSorting: true }
]


export default function Items(props) {
    const classes = useStyles()
    const [allItems, setAllItems] = React.useState(itemService.getItems())
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })




    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        temp.quantity = fieldValues.quantity ? "" : "Quantity can not be negative."
        setErrors({
            ...temp
        })
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
    } = useTable(allItems, allItemsHeadCells, filterFn)


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


    // const handleSubmit = (e) => {
    //     e.preventDefault()
    //     if (validate()) {
    //         addOrEdit(values, resetForm)
    //     }
    // }

    const [addingItem, setAddingItem] = React.useState({})
    const [openItemPopup, setOpenItemPopup] = useState(false)
    
    return (
        <>

            <Popup
                openPopup={openItemPopup}
                title="Add Item to Requisition"
                setOpenPopup={setOpenItemPopup}
            >
                <Form>
                    <Grid container>
                        <Grid item xs={12}>
                            <Controls.Input
                                label='Item'
                                value={addingItem.name}
                                disabled={true}
                            />
                            <Controls.Input
                                label='Category'
                                value={addingItem.category}
                                disabled={true}
                            />
                            <Controls.Input
                                label='Quantity'
                                type='number'
                                value={addingItem.quantity}
                                onChange={()=>{}}
                            />
                        </Grid>
                    </Grid>

                </Form>

            </Popup>

            <br />
            <br /><br /><br />




            <Form >
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
                    />
                </Toolbar>

                <TblContainer>
                    <TblHead />
                    <TableBody>
                        {
                            recordsAfterPagingAndSorting().map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>
                                        <Controls.ActionButton color='primary' onClick={() => { setAddingItem(item); setOpenItemPopup(true) }}>
                                            <SendOutlinedIcon />
                                        </Controls.ActionButton>
                                    </TableCell>
                                    {/* <TableCell>
                                    <Controls.ActionButton color='primary' onClick={() => openInPopup(item)}>
                                        <EditOutlined />
                                    </Controls.ActionButton>

                                    <Controls.ActionButton color='secondary'
                                        onClick={() => {
                                            setConfirmDialog({
                                                isOpen: true,
                                                title: 'Are you sure to delete this record?',
                                                subTitle: "You can't undo this operation",
                                                onConfirm: () => { onDelete(item.id) }
                                            })
                                        }}
                                    >
                                        <CloseIcon />
                                    </Controls.ActionButton>
                                </TableCell> */}
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </TblContainer>
                <TblPagination />
                <br />
                <br />
                <br />

            </Form>
        </>
    )
}

