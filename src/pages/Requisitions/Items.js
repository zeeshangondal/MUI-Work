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
import Notification from '../../components/Notification';



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

const useStyles2 = makeStyles(theme => ({
    root: {
        '& .MuiFormControl-root': {
            width: '80%',
            margin: theme.spacing(1)
        }
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
    const formClasses=useStyles2()
    const [allItems, setAllItems] = React.useState(itemService.getItems())
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        temp.quantity = parseInt(fieldValues.quantity) >= 1 ? "" : "Quantity must b greater than 0."
        setErrors({
            ...temp
        })
        console.log(errors)
        return Object.values(temp).every(x => x == "")
    }
    const {
        values,
        setValues,
        handleInputChange,
        errors,
        setErrors,
        resetForm
    } = useForm({ quantity: 1 }, true, validate);


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


    const handleItemSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            setOpenItemPopup(false)
            props.addItemToRequisition(values)
        }
    }

    const [openItemPopup, setOpenItemPopup] = useState(false)


    

    return (
        <>

            <Popup
                openPopup={openItemPopup}
                title="Add Item to Requisition"
                setOpenPopup={setOpenItemPopup}
            >
                <Form onSubmit={handleItemSubmit} className={formClasses.root}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Controls.Input
                                label='Item'
                                value={values.name}
                            />
                            <Controls.Input
                                label='Category'
                                value={values.category}
                            />
                            <Controls.Input
                                label='Quantity'
                                name='quantity'
                                type='number'
                                value={values.quantity}
                                onChange={handleInputChange}
                                error={errors.quantity}
                            />
                            <br/>
                            <Controls.Button
                                type="submit"
                                text="Submit" 
                            />
                        </Grid>
                    </Grid>

                </Form>

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
                                        <Controls.ActionButton color='primary' onClick={() => { setValues({ ...item ,quantity:1}); setOpenItemPopup(true) }}>
                                            <SendOutlinedIcon />
                                        </Controls.ActionButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </TblContainer>
                <TblPagination />
        </>
    )
}

