import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, InputGroup, FormControl, Alert, Row, FormSelect, SearchSelect } from 'react-bootstrap';
import { fetchExchangeRates } from './ExchangeRateService';
import { getLogisticsPrice } from './LogisticPriceService';
import { countries } from './data/countries';

const Calculator = () => {
    const [exchangeRates, setExchangeRates] = useState({});
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [lastUpdateTime, setLastUpdateTime] = useState('等待更新...');
    const [finalPrice, setFinalPrice] = useState('');
    const [logisticsCategory, setLogisticsCategory] = useState('');
    const [calculationMethod, setCalculationMethod] = useState('');
    const [inputs, setFormData] = useState({
        purchasePrice: '',
        domesticShipping: '',
        productWeight: '',
        expressBoxWeight: 0.05,
        shippingCost: '',
        registrationFee: '',
        profit: 30
    });
    const [filter, setFilter] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    // const fCountryData = countries.map(country => ({
    //     value: country,
    //     label: country,
    // }));
    const filteredCountries = countries.filter(country =>
        country.toLowerCase().includes(filter.toLowerCase())
    );

    const countryRef = useRef();

    // 组件加载时获取汇率
    useEffect(() => {

        const loadExchangeRates = async () => {
            const rates = await fetchExchangeRates();
            setExchangeRates(rates);
            setLastUpdateTime(new Date().toLocaleString());
            console.log(lastUpdateTime)
        };

        loadExchangeRates();
    }, []);
    const handleLogisticPrice = async (expressBoxWeight, productWeight, logisticsCategory, selectedCountry) => {

        if (!expressBoxWeight || !productWeight || !logisticsCategory || !selectedCountry) {
            setCalculationMethod('');

            setFormData((preinputs) => {
                return {
                    ...preinputs,
                    registrationFee: '',
                    shippingCost: '',
                };
            });
            return;
        }
        const totalWeight = parseFloat(productWeight) + parseFloat(expressBoxWeight);

        const logisticsRes = await getLogisticsPrice(logisticsCategory, totalWeight, selectedCountry);
        if (!logisticsRes) {
            // 更新前端信息
            setCalculationMethod('');

            setFormData((preinputs) => {
                return {
                    ...preinputs,
                    registrationFee: '',
                    shippingCost: '',
                };
            });
            return;
        }

        // 更新前端信息
        setCalculationMethod(logisticsRes.calculationMethod);

        setFormData((preinputs) => {
            return {
                ...preinputs,
                registrationFee: logisticsRes.registrationFeePerPiece,
                shippingCost: logisticsRes.freightRatePerKg,
            };
        });

    };

    // 处理汇率变化
    // const handleCurrencyChange = (event) => {
    //     setSelectedCurrency(event.target.value);
    //     handleLogisticPrice(inputs.expressBoxWeight, inputs.productWeight, logisticsCategory, event.target.value);
    // };
    const handleCountryChange = (country) => {
        setSelectedCountry(country);
        if (country.split(':')[1]) {
            setSelectedCurrency(country.split(':')[1]);
            console.log('set:' + country.split(':')[1]);
        } else {
            setSelectedCurrency('')
        }
        handleLogisticPrice(inputs.expressBoxWeight, inputs.productWeight, logisticsCategory, country);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((preinputs) => {
            return {
                ...preinputs,
                [name]: value,
            };
        });
        if (name == 'productWeight') {
            handleLogisticPrice(inputs.expressBoxWeight, value, logisticsCategory, selectedCountry)
        } else if (name == 'expressBoxWeight') {
            handleLogisticPrice(value, inputs.productWeight, logisticsCategory, selectedCountry)
        }
    };

    // 计算产品定价
    const calculatePrice = () => {
        const { purchasePrice, domesticShipping, productWeight, expressBoxWeight, shippingCost, registrationFee, profit } = inputs;
        const exchangeRate = exchangeRates[selectedCurrency];
        const totalWeight = parseFloat(productWeight) + parseFloat(expressBoxWeight);
        const internationalShippingCost = (totalWeight * parseFloat(shippingCost) + parseFloat(registrationFee)) * 1.15;
        const totalCost = parseFloat(purchasePrice) + parseFloat(domesticShipping) + internationalShippingCost + parseFloat(profit);
        const finalPriceInCurrency = totalCost * exchangeRate;
        const finalPriceAfterCommission = finalPriceInCurrency / 0.85;

        setFinalPrice(finalPriceAfterCommission.toFixed(2));
    };



    return (
        <div>
            <h1>产品定价计算器</h1>
            <Form>
                {/* 其他表单项 */}
                <Form.Group controlId="currencySelect">
                    <Form.Label>选择国家：</Form.Label>
                    {/* <Form.Control as="select" value={selectedCurrency} 
                    // onChange={handleCurrencyChange}
                    >
                        {Object.entries(exchangeRates).map(([key, value]) => (
                            <option key={key} value={key}>{key} ({value})</option>
                        ))}
                    </Form.Control> */}
                    <FormControl
                        type="text"
                        placeholder="Search for a country"
                        value={filter}
                        onChange={(e) => {
                            setFilter(e.target.value);
                            //setSelectedCountry('');
                            handleCountryChange('');
                        }}
                    />
                    <Form.Control as="select" value={selectedCountry} onChange={(e) => { handleCountryChange(e.target.value) }} ref={countryRef}>
                        <option key={-1} value={''}>请选择国家</option>
                        {filteredCountries.map((country, index) => (
                            <option key={index} value={country}>{country}</option>
                        ))}
                    </Form.Control>

                </Form.Group>
                <Form.Group controlId="exchangeRate">
                    <Form.Label>汇率：</Form.Label>
                    <InputGroup>
                        <FormControl
                            type="number"
                            aria-label="Readonly input with button addon"
                            readOnly
                            value={exchangeRates[selectedCurrency] || ''}
                        />
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Row} controlId="lastUpdateTime">
                    <Form.Label>最后更新时间:{lastUpdateTime}</Form.Label>
                </Form.Group>
                <Form.Group controlId="logisticsCategory">
                    <Form.Label>物流类目:</Form.Label>
                    <FormSelect
                        aria-label="物流类目"
                        value={logisticsCategory}
                        onChange={(e) => { setLogisticsCategory(e.target.value); handleLogisticPrice(inputs.expressBoxWeight, inputs.productWeight, e.target.value, selectedCountry) }}
                    >
                        <option value="">请选择</option>
                        <option value="yuntuSpecialLineRegistered">云途全球专线挂号（特惠带电）</option>
                        <option value="yuntuSpecialLineRegisteredGeneral">云途全球专线挂号（特惠普货）</option>
                    </FormSelect>
                </Form.Group>

                <Form.Group controlId="calculationMethod">
                    <Form.Label>计算方式:</Form.Label>
                    <FormSelect
                        aria-label="计算方式"
                        value={calculationMethod}
                        onChange={(e) => setCalculationMethod(e.target.value)}
                    >
                        <option value="">自动带出，可手工修正</option>
                        <option value="registeredCalculation">挂号计算</option>
                        <option value="weightBasedCalculation">首重续重计算</option>
                    </FormSelect>
                </Form.Group>

                <Form.Group controlId="purchasePrice">
                    <Form.Label>采购价（元）：</Form.Label>
                    <FormControl
                        type="number"
                        placeholder="Enter purchase price"
                        name="purchasePrice"
                        value={inputs.purchasePrice}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="domesticShipping">
                    <Form.Label>国内运费（元）：</Form.Label>
                    <FormControl
                        type="number"
                        placeholder="Enter domestic shipping cost"
                        name="domesticShipping"
                        value={inputs.domesticShipping}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="productWeight">
                    <Form.Label>产品重量（kg）：</Form.Label>
                    <FormControl
                        type="number"
                        step="0.01"
                        placeholder="Enter product weight"
                        name="productWeight"
                        value={inputs.productWeight}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="expressBoxWeight">
                    <Form.Label>快递盒重量（kg）：</Form.Label>
                    <FormControl
                        type="number"
                        step="0.01"
                        placeholder="Enter express box weight"
                        name="expressBoxWeight"
                        value={inputs.expressBoxWeight}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="shippingCost">
                    <Form.Label>国际运费（元/kg）：</Form.Label>
                    <FormControl
                        type="number"
                        placeholder="Enter shipping cost"
                        name="shippingCost"
                        value={inputs.shippingCost}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="registrationFee">
                    <Form.Label>挂号费（元）：</Form.Label>
                    <FormControl
                        type="number"
                        placeholder="Enter registration fee"
                        name="registrationFee"
                        value={inputs.registrationFee}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="profit">
                    <Form.Label>利润（元）：</Form.Label>
                    <FormControl
                        type="number"
                        placeholder="Enter profit percentage"
                        name="profit"
                        value={inputs.profit}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Button variant="primary" onClick={calculatePrice}>
                    计算产品定价
                </Button>
            </Form>
            <Alert variant="info">
                产品最终售价: {finalPrice}-{selectedCountry}
            </Alert>
        </div>
    );
};

export default Calculator;