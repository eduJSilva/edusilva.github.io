import './Styles/App.scss';
import React from 'react';
import { Provider, connect } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {brands} from '@fortawesome/fontawesome-svg-core/import.macro'
import $ from 'jquery';

//// redux toolkit (I am using Redux toolkit because: "createStore is deprecated")
import { createSlice, configureStore } from '@reduxjs/toolkit';

const twitterIcon = <FontAwesomeIcon icon={brands('twitter')} />

const proxFrase = createSlice({
  name: 'indiceFraseAleatoria',
  initialState: {
    value: 0,
    frases: [{frase: '"lindo dia', autor: 'yo'}, {frase: '"linda tarde', autor: 'tu'}, {frase: '"linda noche', autor: 'nosotros'}], 
    colores: ['red', 'blue', 'black', 'green', 'yellow', 'purple', 'grey', 'orange', 'salmon', 'olive', 'violet']
  },
  reducers: {
    randomIndex: state => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = Math.floor(Math.random() * 3)
      //console.log(`state.value: ${state.value}`)
    },
  }
})

export const {randomIndex} = proxFrase.actions

const store = configureStore({
  reducer: proxFrase.reducer
})

////Ya se pueden usar todos los metodos de Redux!!!
// Can still subscribe to the store
//store.subscribe(() => console.log("getStateSubscribe: ", store.getState()))

//console.log("Store Inicial", store.getState())

// Still pass action objects to `dispatch`, but they're created for us
//store.dispatch(randomIndex())
// {value: random}

//console.log("nuevo Store", store.getState())

///////////////

//React
class MaquinaAleatoria extends React.Component {
  constructor(props) {
    super(props);
    this.pulsador = this.pulsador.bind(this);
  }

  pulsador() {
    //conexión con la acción de Redux -->mapDispatchToProps
    this.props.submitNuevaFrase();
  }

  //Usando jQuery
  componentDidMount(){
    $("h2").css("color", 'grey');
}

  //Renderización
  render() {
    return (
       <div style={{backgroundColor:this.props.colores[this.props.value-1]}} class='container-fluid text-center well' id="quote-box">
        <h1 style={{color:this.props.colores[this.props.value]}} id="text">{this.props.frases[this.props.value].frase}</h1>
        <h2 id="author">{this.props.frases[this.props.value].autor}</h2>
        <button class='btn btn-block btn-primary' id="new-quote" type='Submit' onClick={this.pulsador}>Submit</button>
        <a class='btn btn-link' target="_blank" href="twitter.com/intent/tweet" id="tweet-quote">{twitterIcon}Tuitear la frase</a>
       </div>
    );
  }
};


const mapStateToProps = (state) => {
  return state
};

const mapDispatchToProps = (dispatch) => {
  return {
    submitNuevaFrase: () => {dispatch(randomIndex())
    }
  }
};

//Conexión React/Redux
const Container = connect(mapStateToProps, mapDispatchToProps)(MaquinaAleatoria);

class AppWrapper extends React.Component {
  render() {
    return (
      <Provider store={store}>
      {/* En la primer carga, mi máquina de frases muestra una frase aleatoria */}
        <Container onLoad={store.dispatch(randomIndex())} />
      </Provider>
    );
  }
};


export default AppWrapper;
