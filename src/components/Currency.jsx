import React, { useState, useEffect } from 'react';
import './style.css';
import axios  from 'axios';

const Currency = () => {

    const [sourceCurrency, setSourceCurrency] = useState("usd");
    const [targetCurrency, setTargetCurrency] = useState("inr");
    const [currencyOption, setCurrencyOption] = useState([]);
    const [inputValue, setInputValue] = useState(1);
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // function to get currency keys.
    const currencyKeys = (currency) => {
        fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currency}.json`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                const keys = Object.keys(data[currency]);
                setCurrencyOption(keys);
            })
            .catch((error) => {
                console.error("ERROR:", error.message);
                setError("Failed to fetch currencies. Please try again later.");
            });
    }
    
    useEffect(() => {
        // Call currencyKeys function when sourceCurrency changes
        currencyKeys(sourceCurrency);
    }, [sourceCurrency]);


    // handlesource.
    const handleSourceCurrecncy = (e) =>{
        setSourceCurrency(e.target.value);
        setOutput(""); //Reset output when select box change.
    }

    // handleTargetd.
    const handleTargetedCurrency = (e) => {
        setTargetCurrency(e.target.value);
        setOutput(""); //Reset output when select box change.
    }

    // create a function to fetch currency data.
    const currencyfunction = async(currency) => {
        try {
            setLoading(true);
            const result = await axios.get(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currency}.json`);
            console.log(result.data.date);
            const value = result.data[sourceCurrency];
            const price = value[targetCurrency];
            const outputValue = (inputValue * price).toFixed(2);
            setOutput(outputValue);
            setLoading(false);
        } catch (error) {
            console.log("ERROR :: ", error.message); 
            setError("Failed to perform currency conversion. Please try again later.");
            setLoading(false);
        }
    }



    // function to handle conversion
    const Convert = () => {
        if (inputValue !== "" && parseFloat(inputValue) !== 0) {
            currencyfunction(sourceCurrency);
        } else {
            setOutput(""); // Reset output when input value is blank or zero
        }
    }


    // function to handle input value change
    const handleInputValue = (e) => {
        setInputValue(e.target.value);
        setOutput(""); // Reset output when input value changes
    }


    // function for handle swap.
    const Swap = () => {
        console.log("swap");
        setSourceCurrency(targetCurrency);
        setTargetCurrency(sourceCurrency);
        setOutput(""); // when we click swap reset the output.
    }
    return (
        <>
            <div className='container mt-5'>
                <div className='row'>
                    <div className='custom p-5 rounded mb-5'>
                        <div className='col-lg-12 col-md-12 col-12 text-center mb-4'>
                            <h2 className='fw-bold'>Currency Converter <span className="badge text-bg-primary"><i className="fa-solid fa-sack-dollar"></i></span></h2>
                            <p className='fw-bold'>Check live foreign currency exchange rates</p>
                        </div>
                        <div className='col-lg-12 col-md-12 col-12 mb-4'>
                            <div className='row'>
                                <div className='col-lg-3 col-md-3 col-12 mb-3'>
                                    <input type='number' className='form-control' placeholder='Enter amount' value={inputValue} onChange={handleInputValue}/>
                                </div>
                                <div className='col-lg-4 col-md-4 col-12 mb-3'>
                                    <div className='input-group'>
                                        <select className="form-select" aria-label="Select source currency" value={sourceCurrency} onChange={handleSourceCurrecncy}>
                                            <option>Select source currency</option>
                                            {currencyOption.map((currency) => (
                                                <option key={currency} value={currency}>{currency.toUpperCase()}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-1 col-md-1 col-12 text-center d-grid mb-3">
                                    <button type="button" className="btn btn-outline-primary" onClick={Swap}>
                                        <i className="fas fa-exchange-alt"></i>
                                    </button>
                                </div>
                                <div className='col-lg-4 col-md-4 col-12 mb-3'>
                                    <select className="form-select" aria-label="Select target currency" value={targetCurrency} onChange={handleTargetedCurrency} >
                                        <option>Select target currency</option>
                                        {
                                            currencyOption.map((currency) => (
                                                <option key={currency} value={currency}>{currency.toUpperCase()}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-12 col-md-12 col-12 mb-4'>
                            <div className='row'>
                                <div className='col-lg-8 col-md-8 col-12 mb-3'>
                                    <div className='card'>
                                        <div className='card-body'>
                                            <h5 className='card-title'>Welcome to Currency Converter</h5>
                                            {loading && <p className='text-muted'>Loading...</p>}
                                            {error && <p className='text-danger'>{error}</p>}
                                            {!loading && !error && output !== "" && 
                                                <p className='card-text'>{`${inputValue} ${sourceCurrency.toUpperCase()} = ${output} ${targetCurrency.toUpperCase()}`}</p>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className='col-lg-4 col-md-4 col-12'>
                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                        <button className="btn btn-primary" type="button" onClick={Convert}>Convert</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Currency;
