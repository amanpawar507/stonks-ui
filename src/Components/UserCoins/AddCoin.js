import React from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    TextField
} from "@mui/material";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {ADD_USER_COIN} from "../../graphql/queries";
import {useMutation} from "@apollo/client";

export default function AddCoin({open,setOpen, coinId, userId}) {
    const [ValButtonAdd,setValButtonAdd] = React.useState(false)
    const [addFunc, { data, loading, error }] =
        useMutation(ADD_USER_COIN);
    function handleClose() {
        setOpen(false)
    }
    const formik = useFormik({
        initialValues: {
            CoinName: coinId,
            Quantity: 0,
            Price: 0,
        },
        validationSchema: Yup.object({
            CoinName: Yup.string(),
            Quantity: Yup.number()
                .required('Required'),
            Price: Yup.number()
                .required('Required')
        }),
        onSubmit: values => {
            setValButtonAdd(true)
            console.log("Done!")
            addFunc({
                variables: {
                    userId: userId,
                    coinId: coinId,
                    quantity: Number(values.Quantity),
                    price: Number(values.Price)
                }
            }).then(r => console.log(r))
            console.log(values)
            setValButtonAdd(false)
            setOpen(false)
        },
    });
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add Coin</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Add this coin to your dashboard.
                </DialogContentText>
                <br/>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container alignItems="flex-start" spacing={2}>
                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                disabled={true}
                                multiline
                                id="CoinName"
                                name="CoinName"
                                label="Coin Name"
                                value={formik.values.CoinName}
                                onChange={formik.handleChange}
                                variant={"outlined"}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}/>
                        {formik.errors.CoinName ? <div>{formik.errors.CoinName}</div> : null}
                        <br/>
                        <br/>
                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                multiline
                                id="Quantity"
                                name="Quantity"
                                label="Quantity"
                                value={formik.values.Quantity}
                                onChange={formik.handleChange}
                                variant={"outlined"}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}/>
                        {formik.errors.Quantity ? <div>{formik.errors.Quantity}</div> : null}
                        <br/>
                        <br/>
                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                multiline
                                id="Price"
                                name="Price"
                                label="Price"
                                value={formik.values.Price}
                                onChange={formik.handleChange}
                                variant={"outlined"}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}/>
                        {formik.errors.Price ? <div>{formik.errors.Price}</div> : null}
                        <br/>
                        <br/>
                        <Grid item xs={12}>
                            <Button type="submit"
                                    variant={"contained"}
                                    color={"primary"}
                                    disabled={ValButtonAdd}
                            >Add
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}