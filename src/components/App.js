import React, {Component} from 'react'
import {LineChart, Line, XAxis, YAxis, CartesianGrid} from 'recharts'

function roiCorrection(roi, tRoi) {
  const fRoi = parseFloat(roi) || 0
  const ftRoi = parseFloat(tRoi) || 1
  return 100 * (fRoi - ftRoi) / ftRoi
}

function priceCorrection(price, tPrice) {
  const fPrice = parseFloat(price) || 0
  const ftPrice = parseFloat(tPrice) || 1
  return 100 * (ftPrice - fPrice) / fPrice
}

function calcBalance(clicks) {
  return Math.min(clicks / 200, 1)
}

function calcValue(clicks, params) {
  const balance = calcBalance(clicks)
  const pC = priceCorrection(params.price, params.tPrice)
  const rC = roiCorrection(params.roi, params.tRoi)
  return pC * (1 - balance) + rC * balance
}

function makePlot(params) {
  const base = new Array(20)
  base.fill(1)
  return base.map((v, i) => ({
    name: (i + 1) * 10,
    value: calcValue((i + 1) * 10, params)
  }))
}

const data = [
  {name: 1, value: 2},
  {name: 2, value: 3},
  {name: 3, value: 4},
  {name: 4, value: 3}
]

class App extends Component {
  state = {
    clicks: '',
    priceMin: '',
    priceMax: '',
    targetROI: '',
    targetPrice: '',
    ROI: '',
    price: ''
  }

  handleChange = (event) => {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
  }

  render() {
    const {clicks, priceMin, priceMax, targetROI, targetPrice} = this.state
    const {price, ROI} = this.state
    return (
      <div>
        <h2>Z1 Lab — изучение формул для алгоритмов</h2>
        <div className="row">
          <input name="clicks" type="text" value={clicks} placeholder="Кол-во кликов" onChange={this.handleChange}/>
          <input name="priceMin" type="text" value={priceMin} placeholder="Мин. цена" onChange={this.handleChange}/>
          <input name="priceMax" type="text" value={priceMax} placeholder="Макс. цена" onChange={this.handleChange}/>
          <input name="targetROI" type="text" value={targetROI} placeholder="ROI, целевой" onChange={this.handleChange}/>
          <input name="targetPrice" type="text" value={targetPrice} placeholder="Цена лида, целевая" onChange={this.handleChange}/>
        </div>
        <div className="row">
          <input name="ROI" type="text" value={ROI} placeholder="ROI, текущий" onChange={this.handleChange}/>
          <input name="price" type="text" value={price} placeholder="Цена лида, текущая" onChange={this.handleChange}/>
        </div>
        <LineChart width={500} height={300} data={makePlot({
          price,
          tPrice: targetPrice,
          roi: ROI,
          tRoi: targetROI
        })}>
          <XAxis dataKey="name"/>
          <YAxis/>
          <CartesianGrid stroke="#eee" strokeDasharray="1 1"/>
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </div>
    )
  }
}

export default App
