'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import useSWR from 'swr';
import { fetcherFakeStore } from '@/utils/api';
import { mapAndSortStoreData } from '@/utils/helper';
import { updateStoreData } from '@/store/slice/userSlice';

export function StoreInitializer() {
	const dispatch = useAppDispatch();
	const userData = useAppSelector((state: any) => state.user);
	const { data: storeData } = useSWR(
		["store", "?limit=1000"],
		fetcherFakeStore
	);
	
	useEffect(() => {
		const storeResult = mapAndSortStoreData(storeData);
		if (!userData?.storeData || userData?.storeData?.length === 0) {
			dispatch(updateStoreData(storeResult));
		}
	}, [storeData]);

	return null;
}