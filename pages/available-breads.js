import { useEffect, useState } from "react";

import Main from "../layouts/Main";

import Loader from "../components/Loader";
import axios from "axios";

const AvailableBreads = () => {

    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [allRawData, setAllRawData] = useState([]);
    const [allSizes, setAllSizes] = useState([]);
    const [selectedSize, setSelectedSize] = useState("All");
    const [filteredData, setFilteredData] = useState([]);
    const [searchQ, setSearchQ] = useState("")

    useEffect(() => {
        getAllBreads()
    }, [])

    useEffect(() => {
        searchBread()
    }, [searchQ])

    const getAllBreads = async () => {
        const breadsStock = await axios.get(`https://api.zupa.ng/auth/gt-breads-stock`);
        const allBreadsStock = breadsStock.data.filter(x => x.stockQty > 0)
        setAllRawData(allBreadsStock)
        const allSizesTemp = [...new Set(allBreadsStock.map(x => x.size))];
        allSizesTemp.unshift("All")
        setAllSizes(allSizesTemp)
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

    return (
        <Main>
            {/* {isLoadingProducts && <Loader />} */}
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
                        }} class="magnifier-icon" />
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
                                    return <li key={`${d.size}-${idx}`} style={{ marginBottom: '10px' }}>
                                        <span style={{ fontWeight: 'bold' }}>{d.size} &nbsp; <span style={{
                                            background: "black",
                                            color: "white",
                                            fontSize: 12,
                                            padding: "2px 10px",
                                            borderRadius: 5
                                        }}>{d.count}</span></span>
                                        {
                                            d.items.map((i, idx) => {
                                                return <ul key={`${i.name}-${idx}`} style={{ marginTop: '10px' }}>
                                                    <li style={{ display: "inline-block", paddingLeft: 15 }}>{i.name}</li>
                                                    <li style={{ display: "inline-block", float: "right", paddingRight: 15 }}>{i.stockQty || 0}</li>
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
        </Main>
    );
};

export default AvailableBreads;
