import axios from "axios";

export const POKEMON_BASE_URL = "https://pokeapi.co/api/v2/berry";
export const STORE_BASE_URL = "https://fakestoreapi.com/products";

export const axiosPoke = axios.create({
  baseURL: POKEMON_BASE_URL,
});

export const axiosFakeStore = axios.create({
  baseURL: STORE_BASE_URL,
});

export const fetcherPoke = ([_, url]: [string, string]) =>
  axiosPoke.get(url).then((res) => res.data);

export const fetcherFakeStore = ([_, url]: [string, string]) =>
  axiosFakeStore.get(url).then((res) => res.data);
