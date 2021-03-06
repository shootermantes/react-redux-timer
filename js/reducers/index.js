var actions = require('../actions/index');
var update = require('immutability-helper')

var Card = require('../components/card');

var initialCardState = {
	cards: [],
	timerActive: false,
	username: null,
	userId: null,
	projects: null
};

var timerReducer = function(state, action){
	state = state || initialCardState;

	if ( action.type === actions.GET_CARDS ) {
		var cards = null;
		if (action.cards === null){
			cards = []
		} else {
			
			cards = JSON.parse(action.cards);
		}
		return Object.assign({}, state, { cards: cards })
		// return state

	} else if ( action.type === actions.CREATE_NEW_CARD_SUCCESS ){
		var newCard = {
			projectName: action.cardname,
			currentTime: '00:00:00',
			description: action.description,
			projectId: action.projectId,
			userId: action.userId,
			key: null					// this is kept null until cardsArray gets mapped over to pass in each cards current index position and then changes the state with redux
		};		


		var cardsArray = state.cards.concat(newCard);
		var newArray = cardsArray.map(function(object, index){		// map() used to add the key property of the newCard object in the cardsArray
			object.key = index;
			return object
		});

		// LocalStorage update
		localStorage.setItem('TimerProjectArray', JSON.stringify(cardsArray))

		return Object.assign({}, state, { cards: newArray })		// Changes the state with redux

	} else if ( action.type === actions.SAVE_TIME ){
		var object = state.cards[action.cardIndex];
		var updateObject = update(object, { currentTime: {$apply: function(){return action.time} }}) // uses 'update' (immutability-helper) to grab the object from the array and change the time after it has been paused
		
		state.cards.splice(action.cardIndex, 1, updateObject)			// slice() will remove the object that was updated and inserts the newly updated copy to the current index of that card.
		localStorage.setItem('TimerProjectArray', JSON.stringify(state.cards))
		return Object.assign({}, state, {cards: state.cards})			// the 'state.cards' is the value of cards to change the state on redux
	
	} else if ( action.type === actions.DELETE_CARD ){


		var index = action.key;

		if (index === 0) {		// If the deleted card is in the 0-th position, it will delete that card only

			state.cards.splice(0,1);   // (0,1) - starting at the 0th index delete 1 object

		} else {
			
			state.cards.splice(index, 1);		// Deletes the current card on the page because of passing in the index value

		}

		localStorage.setItem('TimerProjectArray', JSON.stringify(state.cards))

		return Object.assign({}, state, {cards: state.cards})  // Changes the state on redux
	} else if (action.type === actions.GET_USER_SUCCESS){

		var userdata = {
			username: action.userdata.username,
			userId: action.userdata._id
		}

		localStorage.setItem('username', action.userdata.username)

		return Object.assign({}, state, userdata)
		
	} else if (action.type === actions.GET_CARDS_SUCCESS){

		localStorage.setItem('TimerProjectArray', action.projects)

		return Object.assign({}, state, { cards: JSON.parse(action.projects) })
	}

	return state;
};

exports.timerReducer = timerReducer;

