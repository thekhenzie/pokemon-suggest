import { Component, OnInit } from '@angular/core';
import { kantoPokemons, hariellePokemons, typings } from 'model/kanto';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	title = 'app works!';

	constructor() {
		this.title = this.suggestPokemon("golem");
	}

	suggestPokemon(enemyPokemon) {
		const enemyType = kantoPokemons.find(pokemon => pokemon.name.toLowerCase() === enemyPokemon.toLowerCase()).type;
		let message = "\n\n";
		if (!enemyType) {
			message = "Pokémon not found in the Kanto region. ";
			return message;
		}
	
		const weaknesses = this.findWeaknesses(enemyType);
	
		// Find a Pokémon and attack type from Harielle's list that is super effective against the enemy's type
		for (const pokemon of hariellePokemons) {
			for (const attack of pokemon.attacks) {

				if (weaknesses.double && weaknesses.double.includes(attack.type)){
					message += `!!! ${pokemon.name} - ${attack.name} (${attack.type}) to defeat ${enemyPokemon}.\n\n`;
				}
				if (weaknesses.unique && weaknesses.unique.includes(attack.type)) {
					message += `${pokemon.name} - ${attack.name} (${attack.type}) to defeat ${enemyPokemon}.\n\n`;
				}
			}
		}
	
		if(message == "") message = `No suggested Pokémon in Harielle's list can defeat ${enemyPokemon}.`;
		return message;
	}

	findWeaknesses(pokemonType): any {
		let types = pokemonType.split(" ");
		let weakness = [];
		types.forEach(type => {
			weakness.push(typings[type].weaknesses)
		});
		let flatWeakness = [].concat.apply([], weakness).map(i => i.toLowerCase());
		let doubleWeakness = this.findDuplicates(flatWeakness);
		let uniqueWeakness = flatWeakness.filter((item, index) => flatWeakness.indexOf(item) === index);
		let weak = {
			double: doubleWeakness,
			unique: uniqueWeakness
		}
		return weak;
	}

	findDuplicates(arr) {
		const uniqueSet = new Set();
		const duplicates = [];
	
		for (const item of arr) {
			if (uniqueSet.has(item)) {
				duplicates.push(item);
			} else {
				uniqueSet.add(item);
			}
		}
	
		return duplicates;
	}

	// for featching of pokemon
	fetchKantoPokemon(){
		let pokemonData = [];
		fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
		.then(response => response.json())
		.then(function(allpokemon){
			allpokemon.results.forEach(function(pokemon){
				//this.fetchPokemonData(pokemon); 
				let url = pokemon.url // <--- this is saving the pokemon url to a      variable to us in a fetch.(Ex: https://pokeapi.co/api/v2/pokemon/1/)
				fetch(url)
				.then(response => response.json())
				.then(function(pokeData){
						var data = { id: 0, name: "", type: "" };
						data.id = pokeData.id;
						data.name = pokeData.name;
						data.type = pokeData.types.map(type => type['type']['name']).join(' ')
						pokemonData.push(data);
				});
			})
		})
		console.log(pokemonData);
	}
	
	fetchPokemonData(pokemon){
		let url = pokemon.url // <--- this is saving the pokemon url to a      variable to us in a fetch.(Ex: https://pokeapi.co/api/v2/pokemon/1/)
		fetch(url)
		.then(response => response.json())
		.then(function(pokeData){
			this.renderPokemon(pokeData)
		})
	}
	
	renderPokemon(pokeData){
		pokeData.forEach(poke => {
			var data = { id: 0, name: "", type: "" };
			data.id = poke.id;
			data.name = poke.name;
			data.type = this.createTypes(pokeData.types);
			//this.pokemonData.push(data);
		});
	}

	createTypes(types){
		let typeFormat = "";
		types.forEach(function(type){
			typeFormat = typeFormat.concat(type['type']['name']);
		})
		return typeFormat;
	}
	
	ngOnInit() {

	}
	
}
