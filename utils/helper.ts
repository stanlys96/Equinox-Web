export const LOCAL_STORAGE_PRODUCTS = "products";

export const mapAndSortStoreData = (storeData?: any) => {
	try {
		return storeData?.map((data: any) => ({
			...data,
			name: data?.title
		}))?.slice()?.sort((a: any, b: any) => a?.name?.localeCompare(b?.name));
	} catch (e) {
		return storeData;
	}
}

export const mapAndSortPokeData = (pokeData?: any) => {
	try {
		return pokeData?.map((pokeData: any) => ({
			...pokeData,
			id: pokeData?.url?.split("/")?.at(-2)
		}))?.slice()?.sort((a: any, b: any) => a?.name?.localeCompare(b?.name));
	} catch (e) {
		return pokeData;
	}
}

export const filterDataByQuery = (data?: any, query?: string) => {
	try {
		return data?.filter((a: any) => a?.name?.toLowerCase()?.includes(query?.toLowerCase()))
	} catch(e) {
		return data;
	}
}