var React = require('react');
var router = require('react-router');
var connect = require('react-redux').connect;

var Link = router.Link;
var Card = require('./card')
var actions = require('../actions/index');


var Home = React.createClass({

	componentDidMount: function(){
		var username = this.props.username || localStorage.username
		// var localArray = localStorage.getItem('TimerProjectArray');

		this.props.dispatch(actions.getCards(username))
	},

	createCard: function(event){
		event.preventDefault();
		var cardname = document.getElementsByClassName('newcardname')[0].value;
		var carddescription = document.getElementById('newcarddescription').value;
		this.props.dispatch(actions.createNewCard(cardname, carddescription));

		document.formcreate.reset();			// clears the input and textarea field of the side bar 
		document.getElementById('menuToggle').checked = false;		// unchecks the radio button to slide the side bar back in to hide after creating a new card
	},	
		
	render: function(props){
		var username = this.props.username || localStorage.username;
		return (
			<div className="navigation">
				<input type="checkbox" id="menuToggle" />
				
				<header>
					<label htmlFor="menuToggle" className="menu-icon"><img /></label>
					<Link to="/home"><div className="timetracker">Time<img  className="clock" src="../images/watch.png" />Tracker</div></Link>
					<p className="home-username">Welcome: {username}</p>
				</header>
				<nav className="menu">
					<h4 className="sidebar-header">New Card Form</h4>
					<form name="formcreate" className="newform">
						<label>New Card Name</label><br/>
						<input className="newcardname" placeholder="New Card Name" type="text" required={true}></input>
						<label>Description</label>	
						<textarea rows="10" cols="28" id="newcarddescription" placeholder="React/Redux/MongoDB... etc." type="text" required={true}/>
						<input type="submit" className="create-card btn" onClick={this.createCard} value="Create New Card" />
					</form>
				
				</nav>
				<div>
					{this.props.children} 	
				</div>
			</div>
		)
	}
});

var mapStateToProps = function(state, props){
	return {
		cards: state.cards,
		username: state.username
	}
};

var Container = connect(mapStateToProps)(Home)


module.exports = Container;