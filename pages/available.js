import { useEffect, useRef, useState } from "react";

import Main from "../layouts/Main";

import Loader from "../components/Loader";
import axios from "axios";
import { Checkbox, TextField } from "../components/FormElements";
import { API_BASE_URL } from "../constants";
import { v4 as uuidv4 } from 'uuid';
import { FloatButton, message, Modal } from 'antd';
import { WhatsAppOutlined, InstagramOutlined, ReloadOutlined, QuestionCircleOutlined, CopyOutlined, PlusOutlined } from '@ant-design/icons';
import { ModalBread } from "../public/static/vectors";
import { useRouter } from "next/router";

const AvailableBreads = () => {

    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [allRawData, setAllRawData] = useState([]);
    const [allSizes, setAllSizes] = useState([]);
    const [selectedSize, setSelectedSize] = useState("All");
    const [filteredData, setFilteredData] = useState([]);
    const [searchQ, setSearchQ] = useState("")

    const [timerRedirect, setTimerRedirect] = useState(5)

    const [openFloatbuttonGroup, setOpenFloatbuttonGroup] = useState(false)

    const interval = useRef();

    const [showIgRedirectionModal, setShowIgRedirectionModal] = useState(false)

    const router = useRouter()

    useEffect(() => {
        getAllBreads()
    }, [])

    useEffect(() => {
        searchBread()
    }, [searchQ])

    const [cart, setCart] = useState([])

    const getAllBreads = async () => {
        setIsLoadingProducts(true)
        const breadsStock = await axios.get(`${API_BASE_URL}auth/gt-breads-stock`);
        const allBreadsStock = breadsStock.data.filter(x => x.stockQty > 0)
        setAllRawData(allBreadsStock)
        const allSizesTemp = [...new Set(allBreadsStock.map(x => x.size))];
        allSizesTemp.unshift("All")
        setAllSizes(allSizesTemp)
        setIsLoadingProducts(false)
    }

    const normalizeData = (data) => {
        const allSizesTemp = [...new Set(data.map(x => x.size))]
        const dataTemp = [];
        allSizesTemp.forEach(size => {
            if (selectedSize !== "All" && size === selectedSize)
                dataTemp.push({
                    size,
                    items: data.filter(x => x.size === size),
                    count: data.filter(x => x.size === size).map(y => y.stockQty).reduce((acc, nxt) => acc + nxt, 0)
                })
            else if (selectedSize === "All")
                dataTemp.push({
                    size,
                    items: data.filter(x => x.size === size),
                    count: data.filter(x => x.size === size).map(y => y.stockQty).reduce((acc, nxt) => acc + nxt, 0)
                })
        });

        return dataTemp
    }

    const searchBread = async () => {
        let dataTemp = normalizeData(allRawData)
        if (!searchQ)
            return setFilteredData(dataTemp)
        dataTemp = normalizeData(allRawData.filter(x => x.size.trim().toLowerCase().includes(searchQ.trim().toLowerCase()) || x.name.trim().toLowerCase().includes(searchQ.trim().toLowerCase())))
        setFilteredData(dataTemp)
    }

    const selectSize = async (e, size) => {
        for (let i = 0; i < document.getElementsByClassName("sizesLi").length; i++) {
            const el = document.getElementsByClassName("sizesLi")[i];
            el.style.background = 'rgb(246 246 249)'
        }
        e.target.style.background = '#e7e7ff';

        setSelectedSize(size)
        setSearchQ("")
    }

    useEffect(() => {
        let dataTemp = normalizeData(allRawData)
        if (selectedSize === "All")
            return setFilteredData(dataTemp)

        dataTemp = normalizeData(allRawData.filter(x => x.size === selectedSize))
        setFilteredData(dataTemp)
    }, [selectedSize, allRawData])

    const checkSize = (size, e) => {
        const filteredDataTmp = JSON.parse(JSON.stringify(filteredData))
        filteredDataTmp.find(x => x.size === size.size).checked = e.target.checked

        let cartTmp = JSON.parse(JSON.stringify(cart))
        if (e.target.checked)
            filteredDataTmp.find(x => x.size === size.size).items.map(x => {
                if (!cartTmp.find(c => c.id === x.id)) {
                    if (
                        (
                            searchQ && (
                                x.name.trim().toLowerCase().includes(searchQ.trim().toLowerCase()) ||
                                x.size.trim().toLowerCase().includes(searchQ.trim().toLowerCase())
                            )
                        ) || !searchQ
                    )
                        cartTmp.push({
                            id: x.id,
                            name: x.name,
                            stockQty: x.stockQty,
                            quantityToPurchase: 1,
                            size: size.size
                        })
                }
            })
        else
            cartTmp = cartTmp.filter(c => c.size !== size.size)

        debugger
        setCart(cartTmp)

        setFilteredData(filteredDataTmp)
    }

    const checkItem = (size, item, e) => {
        let cartTmp = JSON.parse(JSON.stringify(cart))

        if (e.target.checked)
            cartTmp.push({
                id: item.id,
                quantityToPurchase: 1,
                name: item.name,
                stockQty: item.stockQty,
                size: size.size
            });
        else
            cartTmp = cartTmp.filter(x => x.id !== item.id)

        setCart(cartTmp)
        setOpenFloatbuttonGroup(true)
    }

    const getTxtToCopy = () => {
        const toCopy = cart.map(x => {
            return {
                name: x.name,
                stockQty: x.stockQty,
                quantityToPurchase: cart.find(c => c.id === x.id).quantityToPurchase,
                size: x.size
            }
        });
        let txtToCopy = [];
        toCopy.map(x => {
            txtToCopy.push(`${x.size} - ${x.name} - ${x.quantityToPurchase}`)
        })

        return txtToCopy.join(`\n\n`)
    }

    const validateSelectedItems = () => {
        if (!cart.length) {
            message.warning("Please select a product first")
            return false
        }

        return true
    }

    const copyToClipboard = async (txtToAppend = "") => {
        if (!validateSelectedItems()) return
        await navigator.clipboard.writeText(`${txtToAppend}${getTxtToCopy()}`)
        message.success(`Copied to clipboard`)
    }

    const [showCheckoutModal, setShowCheckoutModal] = useState(false)

    const placeOrder = (source) => {
        if (!validateSelectedItems()) return
        var message = encodeURIComponent(`Hello, I want to order these items: \n\n${getTxtToCopy()} `);
        if (source === "whatsapp") {
            var phoneNumber = "2347018249203";
            var whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
            window.open(whatsappUrl, "_blank");
        }
        else if (source === "insta") {
            copyToClipboard(`Hello, I want to order these items: \n\n`)
            setShowIgRedirectionModal(true)
            interval.current = setInterval(() => {
                setTimerRedirect(prevTimer => prevTimer - 1);
            }, 1000);
        }
        else if (source === "website") {
            const cartItems = localStorage.getItem("gourmettwistcart") ? JSON.parse(localStorage.getItem("gourmettwistcart")) : [];
            filteredData.filter(x => x.items.filter(i => cart.find(c => c.id === i.id)).length).forEach(x => {
                x.items.filter(i => cart.find(c => c.id === i.id)).forEach(item => {
                    if (cartItems.find(c => c.id === item.id)) {
                        const newQty = parseInt(cartItems[cartItems.findIndex(c => c.id === item.id)].quantity) + parseInt(cart.find(c => c.id === item.id).quantityToPurchase)
                        cartItems[cartItems.findIndex(c => c.id === item.id)] = {
                            ...cartItems.find(c => c.id === item.id),
                            quantity: newQty,
                            totalCost: newQty * item.unitPrice
                        }
                    } else cartItems.push({
                        uuid: uuidv4(),
                        id: item.id,
                        size: x.size,
                        unitPrice: item.unitPrice,
                        imageUrl: item.imageUrl,
                        name: item.name,
                        quantity: cart.find(c => c.id === item.id).quantityToPurchase,
                        toppings: [],
                        totalCost: cart.find(c => c.id === item.id).quantityToPurchase * item.unitPrice
                    })
                });
            });
            localStorage.setItem("gourmettwistcart", JSON.stringify(cartItems))
            setShowCheckoutModal(`Added x${cartItems.length} item(s) successfully to the cart`)
        }
    }

    useEffect(() => {
        if (timerRedirect <= 1) {
            clearInterval(interval.current)
            window.open(`https://ig.me/m/gourmettwist`, "_blank")
            setShowIgRedirectionModal(false)
            setTimerRedirect(5)
        }
    }, [timerRedirect])

    const changePurchaseQty = (size, item, e) => {
        if (filteredData.find(x => x.size === size.size).items.find(x => x.id === item.id).stockQty < parseInt(e.target.value)) return message.warning("Please do not provide quantity more than available stock")

        const cartTmp = JSON.parse(JSON.stringify(cart))
        cartTmp.find(c => c.id === item.id).quantityToPurchase = e.target.value
        setCart(cartTmp)
    }

    return (
        <Main>
            {isLoadingProducts && <Loader />}
            <div style={{ display: 'flex', marginTop: '3%' }}>
                <div style={{ flex: 0.3 }}></div>
                <div style={{ flex: 0.3 }}></div>
                <div style={{ flex: 1, fontSize: '14pt' }}>
                    <div style={{
                        overflowX: 'auto',
                        whiteSpace: 'nowrap',
                        display: 'flex'
                    }}>
                        <ul style={{
                            listStyle: 'none',
                            display: 'flex',
                            cursor: 'pointer !important',
                            width: '100%'
                        }}>
                            {
                                allSizes.map((s, idx) => <li className="sizesLi" onClick={(e) => selectSize(e, s)} style={{
                                    // display: "inline-block",
                                    background: (s === "All" ? "#e7e7ff" : "rgb(246 246 249)"),
                                    color: "black",
                                    padding: "5px 15px",
                                    borderRadius: 15,
                                    fontWeight: "bold",
                                    textAlign: 'center',
                                    fontSize: `11pt`,
                                    flex: 1,
                                    marginRight: (idx === allSizes.length - 1 ? '0px' : '10px')
                                }}>{s}</li>)
                            }
                        </ul>
                    </div>
                    <br />
                    <div style={{ position: 'relative' }}>
                        <img src="./magnifier-icon.png" alt="Search" style={{
                            position: "absolute",
                            left: 10 /* adjust the left position as needed */,
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            width: '20px'
                        }} className="magnifier-icon" />
                        <input placeholder="Search with item name and size" style={{
                            width: "100%",
                            padding: 10,
                            fontSize: "12pt",
                            background: "#f2f3f5",
                            fontWeight: "bold",
                            border: 0,
                            paddingLeft: '35px'
                        }} type="text" value={searchQ} onChange={(e) => setSearchQ(e.target.value)} />
                    </div>
                    <br />
                    <div>
                        <ul>
                            {
                                filteredData.map((d, idx) => {
                                    return <li key={`${d.size}-${idx}`} style={{ marginBottom: '10px', marginTop: idx === 0 ? 20 : 0 }}>
                                        <Checkbox
                                            checked={d.checked}
                                            onChange={e => checkSize(d, e)}
                                            availableBreadMainLabel={d.size} />
                                        &nbsp;&nbsp;
                                        <span style={{
                                            background: "black",
                                            color: "white",
                                            fontSize: 12,
                                            padding: "2px 10px",
                                            borderRadius: 5
                                        }}>{d.count}</span>
                                        {
                                            d.items.map((i, idx) => {
                                                return <ul key={`${i.name}-${idx}`} style={{
                                                    marginTop: '20px',
                                                    borderTop: '1px solid rgb(228 212 212)',
                                                    paddingTop: '20px',
                                                    marginBottom: (d.items.length - 1) === idx ? '30px' : null,
                                                    borderBottom: (d.items.length - 1) === idx ? '3px solid rgb(228 212 212)' : null,
                                                    paddingBottom: (d.items.length - 1) === idx ? '30px' : null
                                                }}>
                                                    <li style={{ display: "inline-block", paddingLeft: 15 }}>
                                                        <Checkbox
                                                            checked={cart.find(c => c.id === i.id) ? true : false}
                                                            onChange={e => checkItem(d, i, e)}
                                                            availableBreadChildLabel={i.name} />
                                                    </li>
                                                    <li style={{ display: "inline-block", float: "right", paddingRight: 15 }}>
                                                        {
                                                            cart.find(c => c.id === i.id) && <input placeholder="0"
                                                                value={cart.find(c => c.id === i.id).quantityToPurchase}
                                                                style={{
                                                                    marginRight: 20,
                                                                    height: 25,
                                                                    borderRadius: 5,
                                                                    border: "1px solid #bec7d9",
                                                                    width: 50,
                                                                    textAlign: "center"
                                                                }}
                                                                onChange={(e) => changePurchaseQty(d, i, e)} />
                                                        }
                                                        {i.stockQty || 0}
                                                    </li>
                                                </ul>
                                            })
                                        }
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                </div>
                <div style={{ flex: 0.3 }}></div>
                <div style={{ flex: 0.3 }}></div>
            </div>

            <FloatButton.Group
                open={openFloatbuttonGroup}
                trigger="click"
                onClick={() => setOpenFloatbuttonGroup(!openFloatbuttonGroup)}
                style={{ right: 24 }}
                icon={<PlusOutlined />}
                shape="square"
                type="primary"
            >
                <span id="orderNowHeader">Order now!</span>
                <div className="floatButtonsContainer" onClick={() => {
                    placeOrder("whatsapp")
                    setOpenFloatbuttonGroup(!openFloatbuttonGroup)
                }} >
                    <FloatButton style={{ display: "inline-block" }} tooltip={"Order via whatsapp"} icon={<WhatsAppOutlined />} />
                    <span className="orderNowApps">Whatsapp</span>
                </div>
                <div className="floatButtonsContainer" onClick={() => {
                    placeOrder("insta")
                    setOpenFloatbuttonGroup(!openFloatbuttonGroup)
                }} >
                    <FloatButton style={{ display: "inline-block" }} tooltip={"Order via instagram"} icon={<InstagramOutlined />} />
                    <span className="orderNowApps">Instagram</span>
                </div>
                <div className="floatButtonsContainer" onClick={() => {
                    placeOrder("website")
                    setOpenFloatbuttonGroup(!openFloatbuttonGroup)
                }} >
                    <FloatButton style={{ display: "inline-block" }} tooltip={"Order via website"} icon={<img src="/static/images/splash-logo.png" />} />
                    <span className="orderNowApps">Website</span>
                </div>
                <div className="floatButtonsContainer" onClick={() => {
                    copyToClipboard(`Hello, I want to order these items: \n\n`)
                    setOpenFloatbuttonGroup(!openFloatbuttonGroup)
                }} >
                    <FloatButton style={{ display: "inline-block" }} tooltip={"Copy to clipboard"} icon={<CopyOutlined />} />
                    <span className="orderNowApps">Clipboard</span>
                </div>
                <div className="floatButtonsContainer" onClick={() => {
                    getAllBreads()
                    setOpenFloatbuttonGroup(!openFloatbuttonGroup)
                }} >
                    <FloatButton style={{ display: "inline-block" }} tooltip={"Refresh stock"} icon={<ReloadOutlined />} />
                    <span className="orderNowApps">Refresh</span>
                </div>
            </FloatButton.Group>

            <Modal
                visible={showIgRedirectionModal}
                wrapClassName={"redirectionModal"}
                closeIcon={null}
                centered={true}
                width={300}
                footer={null}>
                <p>Order details are copied to clipboard. You will need to paste in the chatbox</p>
                <br />
                <p style={{ fontWeight: 600 }}>Opening instagram chat box in {timerRedirect}...</p>
            </Modal>

            <Modal
                visible={showCheckoutModal}
                closeIcon={null}
                centered={true}
                width={350}
                footer={null}>
                <div className="add-cart-success">
                    <div className="icon">
                        <ModalBread />
                    </div>
                    <div className="message">{showCheckoutModal}</div>
                    <div className="actions">
                        <button
                            className="continue"
                            onClick={() => {
                                location.href = "/cart"
                            }}
                        >
                            Checkout
                        </button>
                        <button
                            className="go-checkout"
                            onClick={() => setShowCheckoutModal(false)}
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </Modal>
        </Main >
    );
};

export default AvailableBreads;
