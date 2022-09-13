import './Styles/App.scss';
import React from 'react';
import { Provider, connect } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {brands} from '@fortawesome/fontawesome-svg-core/import.macro'
import $ from 'jquery';


//// redux toolkit (I am using Redux toolkit because: "createStore is deprecated")
import { createSlice, configureStore } from '@reduxjs/toolkit';

/*
function setup(){
	
	var $passage = $('#text');
	
	//get the inner HTML of the #weirdtext paragraph
	var rawtxt = $passage.html();
	
	//Get the length of the string for use in loop
	var len = rawtxt.length;
	
	//empty string used to store final text that includes spans
	var newtext = '';

	
	//For each character inside #weirdtext string (this is why we got length)
	for(var i = 0; i < len; i ++){
		
		//get a random num between 1 and 5
		var rng = Math.floor(Math.random() * 5) + 1;
		
		//get the i-th character from the string
		var currentchar = rawtxt.charAt(i);
		if(currentchar === ' '){
			//if it's a space, add an empty .space span
			var newchar = '<span class="space"></span>';
		}
		else{
			//otherwise, wrap it with a span, and give it class effectN, where N is a random int as before
			var newchar = '<span class="effect' + rng + '">' + currentchar + '</span>';
		}
		//add this new "char" (actually it's a char with spans wrapping it) to the empty string
		newtext = newtext + newchar;
	}
	
	//replace #weirdtext paragraphs inner HTML with the newly created string
	$passage.html(newtext);
	
}
*/

// ** Colour Contrast Calculator ** //
// ** https://www.w3.org/TR/AERT#color-contrast ** //
// ** ((Red value X 299) + (Green value X 587) + (Blue value X 114)) / 1000 ** // 
let coloresS=()=>{
  for(var i = 0; i < 100; i++){
 // Get element
  var el = document.getElementById("quote-box");
 // Generate random RGB values
  var r = Math.floor((Math.random() * 256) - 1);
  var g = Math.floor((Math.random() * 256) - 1);
  var b = Math.floor((Math.random() * 256) - 1);
  console.log(r, g, b);
 // Calculate brightness of randomized colour
 var brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
 // Calculate brightness of white and black text
 var lightText = ((255 * 299) + (255 * 587) + (255 * 114)) / 1000;
 var darkText = ((0 * 299) + (0 * 587) + (0 * 114)) / 1000;
  
  // Apply background colour to current element
  el.style.backgroundColor = "rgb("+ r +","+ g +","+ b +")";
  
  // Determine contrast of colour for element text and assign either white or black text depending
    
  if(Math.abs(brightness - lightText) > Math.abs(brightness - darkText)){
    el.style.color = "rgb(255, 255, 255)";
  } else {
    el.style.color = "rgb(0, 0, 0)";
  }
};
}
// ** Colour Contrast Calculator ** //

const twitterIcon = <FontAwesomeIcon icon={brands('twitter')} />

//Redux
const proxFrase = createSlice({
  name: 'indiceFraseAleatoria',
  initialState: {
    value: 0,
    frases: [{frase: '"La duda es uno de los nombres de la inteligencia.', autor: 'Jorge Luis Borges'}, {frase: '"La eternidad es una de las raras virtudes de la literatura.', autor: 'Adolfo Bioy Casares'}, {frase: '"La cultura es el ejercicio profundo de la identidad.', autor: 'Julio Cortázar'}],
  },
  reducers: {
    randomIndex: state => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = Math.floor(Math.random() * state.frases.length)
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
    //setup();
    coloresS();
  }

  //Usando jQuery
 // componentDidMount(){
   // var contents = $('#text');
    //contents.toUpperCase();
//}

  //Renderización
  render() {
    return (
       <div className=' container text-center well' id="quote-box">
        <h1 id="text">{this.props.frases[this.props.value].frase}</h1>
        <h2 id="author">{this.props.frases[this.props.value].autor}</h2>
        <br />
        <button className='btn btn-block btn-primary' id="new-quote" type='Submit' onClick={this.pulsador}>Submit</button>
        <a className='btn btn-link' target="_blank" href="twitter.com/intent/tweet" id="tweet-quote">{twitterIcon}Tuitear la frase</a>
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
