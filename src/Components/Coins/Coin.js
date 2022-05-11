import {useQuery, useSubscription} from "@apollo/client";
import {useEffect, useState} from "react";
import CurrencyConverter from "../Common/CurrencyConverter";
import {Box, Button, CircularProgress, Grid, IconButton, Stack, Typography} from "@mui/material";
import {greyColor, pinkColor} from "../../Common/Colors";
import Color from "color";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import coinStyle from "./css/coin.module.css";
import {GET_CHART, GET_COIN} from "../../graphql/queries";
import {COIN_SUBSCRIPTION} from "../../graphql/subscription";
import {getDollarNumber, getDollarText} from "../../Common/CommonFunctions";
import {useParams} from "react-router-dom";
import ChartSelector from "../Chart/ChartSelector";
import Sparkline from "../Common/Sparkline";
import PriceUpDown from "../Common/PriceUpDown";
import ChartClass from "../Chart/ChartFunctional";
import AnimatedNumberFormat from "../Common/AnimatedNumberFormat";
import Loading from "../Loading/Loading";
import Error from "../Error/CustomError";
import useScrollBlock from "../../Common/useScrollBlock";
import AddCoin from "../UserCoins/AddCoin";
import DeleteCoin from "../UserCoins/DeleteCoin";
import UpdateCoin from "../UserCoins/UpdateCoin";
import {useStoreState} from "easy-peasy";


const Coin = () => {
    const {id} = useParams()
    const [blockScroll, allowScroll] = useScrollBlock();
    const userDetails = useStoreState(state => state.user.userDetails)
    const [openAdd,setOpenAdd] = useState(false)
    const [openDelete,setOpenDelete] = useState(false)
    const [openUpdate,setOpenUpdate] = useState(false)
    const [chartData, setChartData] = useState(null)
    const [chartDuration, setChartDuration] = useState({days: "30", interval: "daily"})
    const [chartType, setChartType] = useState(0)
    const [coinDetails, setCoinDetails] = useState({});
    const {data: coinData, loading: coinLoading, error: coinError, refetch} = useQuery(GET_COIN, {
        variables: {coinId: id},
    });
    const {data: updateCoinData, error: updateCoinDataError} = useSubscription(COIN_SUBSCRIPTION, {
        variables: {coinId: id},
    });
    const {data: chartRawData, loading: chartDataLoading, error: chartDataError} = useQuery(GET_CHART, {
        variables: {coinChartId: id, days: chartDuration.days, interval: chartDuration.interval},
    });


    const changeChartType = (type) => {
        setChartType(type)
    }

    const changeChartDuration = (day, inter) => {
        console.log(day)
        setChartDuration({days: day, interval: inter})
    }

    const onMediaFallback = (event) => (event.target.src = "crypto_logo.png");

    function getRandom(value) {
        const min = value * 0.95;
        const max = value * 1.05;
        return Math.random() * (max - min) + min;
    }

    const stopScroll = () => {
        blockScroll()
    }
    const startScroll = () => {
        allowScroll()
    }

    useEffect(() => {
        if (coinData) {
            setCoinDetails(coinData.coin);
        }
    }, [coinData])


    useEffect(() => {
        if (updateCoinData && updateCoinData.marketData.length > 0) {
            setCoinDetails((coin) => ({
                ...coin, coins_market_data: {
                    ...coin.coins_market_data,
                    currentPrice: updateCoinData.marketData[0].currentPrice,
                    priceChange24h: updateCoinData.marketData[0].priceChange24h,
                    priceChangePercentage24h: updateCoinData.marketData[0].priceChangePercentage24h,
                    high24: updateCoinData.marketData[0].high24,
                    low24: updateCoinData.marketData[0].low24,
                    totalVolume: updateCoinData.marketData[0].totalVolume,
                    sparkline: updateCoinData.marketData[0].sparkline,
                }
            }));
        }
    }, [updateCoinData])

    useEffect(() => {
        if (chartRawData) {
            const cData = []
            for (let d of chartRawData.coinChart) {
                cData.push({
                    date: new Date(+d.date),
                    price: d.price,
                    open: d.open,
                    high: d.high,
                    low: d.low,
                    close: d.close,
                    volume: d.volume,
                })
            }
            setChartData(cData);
        }
    }, [chartRawData])

    if (coinLoading) return <Loading/>
    if (coinError) return <Error message={coinError.message} onClick={refetch}/>
    if (coinDetails && coinDetails.id) {
        return <div
            className={coinDetails.coins_market_data.priceChangePercentage24h > 0 ? coinStyle.radialBGUp : coinStyle.radialBGDown}>
            <Grid container justifyContent={"space-between"} className={coinStyle.frostedHeader}
                  sx={{
                      padding: '15px 0px 15px 30px',
                      // backgroundImage: coinDetails.coins_market_data.priceChangePercentage24h > 0 ? `linear-gradient(to right, #0F0F0F, #0F0F0F, ${Color(downColor).darken(0.6).alpha(0.1)})` : `linear-gradient(to right, #0F0F0F, #0F0F0F, ${Color(downColor).darken(0.6).alpha(0.2)})`,
                  }}>
                <Grid item xs={12} md={4}>
                    <Stack direction={"column"}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link underline="hover" color="inherit" href="/" sx={{fontSize: "0.8em"}}>
                                Home
                            </Link>
                            <Typography color="text.primary" fontSize={"0.8em"}>{coinDetails.name}</Typography>
                        </Breadcrumbs>
                        <Stack direction={"row"} sx={{marginTop: "20px"}} spacing={1}>
                            <Stack direction={"column"} justifyContent={"space-around"}>
                                <img src={coinDetails.image} alt={coinDetails.name} className={coinStyle.coinImage}
                                     onError={onMediaFallback} style={{marginBottom: '10px'}}/>
                                <Stack direction={"column"}>
                                    <Typography variant={"body2"} color={greyColor} fontWeight={"500"}
                                                textAlign={"center"}>
                                        {coinDetails.symbol.toUpperCase()}
                                    </Typography>
                                    <Typography variant={"body2"} color={greyColor} fontWeight={"500"}
                                                textAlign={"center"}>
                                        Price
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Stack direction={"column"} justifyContent={"space-around"}>
                                <Stack direction={"row"} alignItems={"baseline"} spacing={1}>
                                    <Typography component={"p"} fontWeight={"500"} fontSize={"3em"} lineHeight={1}>
                                        {coinDetails.name}
                                    </Typography>
                                    <Typography component={"p"} color={greyColor}>
                                        {`(${coinDetails.symbol.toUpperCase()})`}
                                    </Typography>
                                </Stack>
                                <Stack direction={"row"} spacing={1} alignItems={"baseline"} sx={{marginTop: "5px"}}>
                                    <AnimatedNumberFormat displayType={'text'}
                                                          value={coinDetails.coins_market_data.currentPrice}
                                                          thousandSeparator={true} decimalScale={5} fixedDecimal={true}
                                                          prefix="$" decimalSeparator="." className={coinStyle.price}/>
                                    <PriceUpDown value={coinDetails.coins_market_data.priceChangePercentage24h}
                                                 fontSize={"1.5em"}
                                                 fontWeight={"500"}/>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Stack direction={"row"} spacing={3} sx={{marginTop: '20px'}}>
                            <Button variant="outlined" startIcon={<AddIcon/>} color={"success"} onClick={() => {
                                setOpenAdd(true)
                            }}>
                                Add
                            </Button>
                            <AddCoin open={openAdd} setOpen={setOpenAdd} coinId = {coinDetails.id} userId={userDetails.id}/>
                            <Button variant="outlined" startIcon={<RemoveIcon/>} color={"error"} onClick={() => {
                                setOpenDelete(true)
                            }}>
                                Remove
                            </Button>
                            <DeleteCoin open={openDelete} setOpen={setOpenDelete} coinId = {coinDetails.id} userId={userDetails.id}/>
                            <Button variant="outlined" startIcon={<EditIcon/>} color={"secondary"} onClick={() => {
                                setOpenUpdate(true)
                            }}
                                    sx={{color: `${Color(pinkColor).lighten(0.35)}`}}>
                                Edit
                            </Button>
                            <UpdateCoin open={openUpdate} setOpen={setOpenUpdate} coinId = {coinDetails.id} userId={userDetails.id}/>
                            <IconButton aria-label="fingerprint">
                                <StarOutlineIcon/>
                            </IconButton>

                        </Stack>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={3}>
                    <div className={coinStyle.sparkline}>

                        {coinDetails.coins_market_data.priceChangePercentage24h >= 0 &&
                            <Sparkline id={coinDetails.id} data={coinDetails.coins_market_data.sparkline}
                                       decreaseDetail={false}
                                       height={120} lineTension={0.3}
                                       neutralUpDown={1}
                                       fill={true}/>}
                        {coinDetails.coins_market_data.priceChangePercentage24h < 0 &&
                            <Sparkline id={coinDetails.id} data={coinDetails.coins_market_data.sparkline}
                                       decreaseDetail={false}
                                       height={120} lineTension={0.3}
                                       neutralUpDown={2}
                                       fill={true}/>}
                    </div>
                </Grid>
            </Grid>
            <div style={{padding: '30px'}}>
                <Box className={coinStyle.frostedDiv}>
                    <Stack direction={"row"} spacing={1} justifyContent={"space-evenly"} flexWrap={"wrap"}>
                        <Stack direction={"column"}>
                            <Typography variant={"body2"} color={greyColor}>
                                RANK
                            </Typography>
                            <Typography variant={"h6"} component={"p"}>
                                #{coinDetails.coins_market_data.rank}
                            </Typography>
                        </Stack>
                        <Stack direction={"column"}>
                            <Typography variant={"body2"} color={greyColor}>
                                PRICE CHANGE (24H)
                            </Typography>
                            <PriceUpDown fontWeight={500} fontSize={"1.2em"}
                                         value={coinDetails.coins_market_data.priceChange24h} prefix={"$"}
                                         suffix={""}
                                         decimals={5} arrow={false}/>
                        </Stack>
                        <Stack direction={"column"}>
                            <Typography variant={"body2"} color={greyColor}>
                                MARKET CAP
                            </Typography>
                            <AnimatedNumberFormat displayType={'text'}
                                                  value={getDollarNumber(coinDetails.coins_market_data.marketCap)}
                                                  thousandSeparator={true}
                                                  decimalScale={5}
                                                  prefix="$" decimalSeparator="."
                                                  suffix={getDollarText(coinDetails.coins_market_data.marketCap)}
                                                  className={coinStyle.marketCap}/>
                        </Stack>
                        <Stack direction={"column"}>
                            <Typography variant={"body2"} color={greyColor}>
                                VOLUME
                            </Typography>
                            <AnimatedNumberFormat displayType={'text'}
                                                  value={getDollarNumber(coinDetails.coins_market_data.totalVolume)}
                                                  thousandSeparator={true}
                                                  decimalScale={5}
                                                  prefix="$" decimalSeparator="."
                                                  suffix={getDollarText(coinDetails.coins_market_data.totalVolume)}
                                                  className={coinStyle.marketCap}/>
                        </Stack>
                        <Stack direction={"column"}>
                            <Typography variant={"body2"} color={greyColor}>
                                TOTAL COINS
                            </Typography>
                            <AnimatedNumberFormat displayType={'text'}
                                                  value={getDollarNumber(coinDetails.coins_market_data.totalCoins)}
                                                  suffix={getDollarText(coinDetails.coins_market_data.totalCoins)}
                                                  thousandSeparator={true}
                                                  decimalScale={5}
                                                  decimalSeparator="." className={coinStyle.marketCap}/>
                        </Stack>
                        <Stack direction={"column"}>
                            <Typography variant={"body2"} color={greyColor}>
                                ACTIVE COINS
                            </Typography>
                            <AnimatedNumberFormat displayType={'text'}
                                                  value={getDollarNumber(coinDetails.coins_market_data.totalActiveCoins)}
                                                  suffix={getDollarText(coinDetails.coins_market_data.totalActiveCoins)}
                                                  thousandSeparator={true}
                                                  decimalScale={5}
                                                  decimalSeparator="." className={coinStyle.marketCap}/>
                        </Stack>
                        <div>
                            <Stack direction={"row"}>
                                <Stack direction={"column"}>
                                    <Typography variant={"body2"} color={greyColor} sx={{padding: "5px 20px"}}>
                                        1H
                                    </Typography>
                                    <div style={{border: `0.5px solid ${Color(greyColor).alpha(0.4)}`}}/>
                                    <div style={{padding: "5px 20px"}}>
                                        <PriceUpDown value={coinDetails.coins_market_data.priceChangePercentage1h}
                                                     prefix={""} arrow={false} fontWeight={500} fontSize={"0.95em"}/>
                                    </div>
                                </Stack>
                                <div style={{border: `0.5px solid ${Color(greyColor).alpha(0.4)}`}}/>
                                <Stack direction={"column"}>
                                    <Typography variant={"body2"} color={greyColor} sx={{padding: "5px 20px"}}>
                                        1D
                                    </Typography>
                                    <div style={{border: `0.5px solid ${Color(greyColor).alpha(0.4)}`}}/>
                                    <div style={{padding: "5px 20px"}}>
                                        <PriceUpDown value={coinDetails.coins_market_data.priceChangePercentage24h}
                                                     prefix={""} arrow={false} fontWeight={500} fontSize={"0.95em"}/>
                                    </div>
                                </Stack>
                                <div style={{border: `0.5px solid ${Color(greyColor).alpha(0.4)}`}}/>
                                <Stack direction={"column"}>
                                    <Typography variant={"body2"} color={greyColor} sx={{padding: "5px 20px"}}>
                                        1W
                                    </Typography>
                                    <div style={{border: `0.5px solid ${Color(greyColor).alpha(0.4)}`}}/>
                                    <div style={{padding: "5px 20px"}}>
                                        <PriceUpDown value={coinDetails.coins_market_data.priceChangePercentage7d}
                                                     prefix={""} arrow={false} fontWeight={500} fontSize={"0.95em"}/>
                                    </div>
                                </Stack>
                                <div style={{border: `0.5px solid ${Color(greyColor).alpha(0.4)}`}}/>
                                <Stack direction={"column"}>
                                    <Typography variant={"body2"} color={greyColor} sx={{padding: "5px 20px"}}>
                                        1M
                                    </Typography>
                                    <div style={{border: `0.5px solid ${Color(greyColor).alpha(0.4)}`}}/>
                                    <div style={{padding: "5px 20px"}}>
                                        <PriceUpDown value={coinDetails.coins_market_data.priceChangePercentage30d}
                                                     prefix={""} arrow={false} fontWeight={500} fontSize={"0.95em"}/>
                                    </div>
                                </Stack>
                                <div style={{border: `0.5px solid ${Color(greyColor).alpha(0.4)}`}}/>
                                <Stack direction={"column"}>
                                    <Typography variant={"body2"} color={greyColor} sx={{padding: "5px 20px"}}>
                                        1Y
                                    </Typography>
                                    <div style={{border: `0.5px solid ${Color(greyColor).alpha(0.4)}`}}/>
                                    <div style={{padding: "5px 20px"}}>
                                        <PriceUpDown value={coinDetails.coins_market_data.priceChangePercentage1y}
                                                     prefix={""} arrow={false} fontWeight={500} fontSize={"0.95em"}/>
                                    </div>
                                </Stack>
                            </Stack>
                        </div>
                    </Stack>
                </Box>
                <Grid container alignItems={"start"} columnSpacing={8} sx={{marginTop: '30px'}}>
                    <Grid item md={4} xs={12}>
                        <CurrencyConverter
                            image={coinDetails.image}
                            symbol={coinDetails.symbol}
                            value={coinDetails.coins_market_data.currentPrice}/>
                    </Grid>
                    <Grid item md={8} xs={12}>
                        <Stack direction={"column"} spacing={1} sx={{width: "100%"}}
                        >
                            <Box sx={{width: 'fit-content', margin: '1em auto 0 auto'}}>
                                <ChartSelector durationChange={changeChartDuration} chartTypeChange={changeChartType}/>
                            </Box>
                            <Box id={"chartBox"}
                                 onMouseEnter={stopScroll}
                                 onMouseLeave={startScroll}
                                 className={`${coinStyle.chart} ${coinStyle.frostedDivNoPad}`}
                                 sx={{
                                     width: "100%",
                                     height: '550px',
                                     marginTop: "20px !important",
                                 }}>
                                {!chartData ? <div style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center", width: "100%",
                                        height: '550px',
                                    }}>
                                        <CircularProgress/>
                                    </div> :
                                    <ChartClass type={"hybrid"}
                                                ratio={2}
                                                data={chartData}
                                                chartType={chartType}/>}
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            </div>

        </div>
    }
    return (
        <div>
            No coins found
        </div>
    )
}

export default Coin