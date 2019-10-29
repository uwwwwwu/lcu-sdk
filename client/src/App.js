import React from 'react';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';

import { HashRouter as Router } from 'react-router-dom';

function App() {
	return (
		<Router>
			<Header/>
			<Main/>
			<Footer/>
		</Router>
	);
}
export default App;
