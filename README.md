# POKEAPI-Browser
Its a React + TypeScript SPA for searching and browsing Pokemons. 

## Live site

https://pokeapi-browser.vercel.app/

## Features

Search and filter Pokemon by name.
Loading, error and empty states at the list and detail level.
Grid view of results
Detail view of results when one pokemon is clicked.

## Component and State structure.

I split the browser in two layer: data and UI. I did this because i had thought of keeping logic out of components so that it could allow me to test each piece in isolation.

Data layer: 'api/pokemon.ts' it has two typed functions that hit PokeAPI. Also "fetch" only rejects on network failure. So i added a check "response.ok" that throws an error when response comes back bad. So a broken request would succeed silently but with junk data rather than actually failing. 'usePokemonDetail' and 'usePokemonList' wraps those calls and own there error/loading state. They both have a 'cancelled' flag inside 'useEffect' cleanup so that if the input is changed mid request the old response gets dropped and isnt competing with the newer one and try to overwrite it.

UI layer: States that matter like: 'search' text, 'selected' Pokemon, live in 'App.tsx' and arent scattered. The 'SearchBar' and 'PokemonCard' dont have any states they just render whats given and call a function when something happens.

The filtering was done with 'useMemo' so typing in the search box doesnt refresh anything it just goes against the list thats already loaded.

To be honest the one thing that caught me off guard that seemed simple in theory was "loading/error state" i thought it was simple until i was separating the two fetches (list + detail) that each should be in their own loading/error state independently and make sure they dont like step on each other.

## Setup

npm install
npm run dev
