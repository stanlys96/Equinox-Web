"use client";
import useSWR from "swr";
import { fetcherPoke } from "@/utils/api";
import { filterDataByQuery, mapAndSortPokeData } from "@/utils/helper";
import { LoadingSkeleton, SearchBar, TableComponent } from "@/components";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect, useMemo, useState } from "react";
import { updateOffset, updatePagination } from "@/store/slice/userSlice";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(userData?.currentPagination);
  const [pokeQuery, setPokeQuery] = useState(params?.get("query") || "");
  const { data: pokeData } = useSWR(
    ["poke", "?limit=1000"],
    fetcherPoke
  );
  const pokeResult = mapAndSortPokeData(pokeData?.results);
  const totalPages = Math.ceil(pokeResult?.length / pageSize);
  const showPrevButton = currentPage !== 1;
  const showNextButton = currentPage !== totalPages;
  const pokeFinalResult = pokeQuery ? filterDataByQuery(pokeResult, pokeQuery) : pokeResult;

  const handleArrowButton = (next: boolean) => {
    if (next) {
      dispatch(updateOffset(currentPage * pageSize));
      setCurrentPage((p) => Math.min(p + 1, totalPages));
    } else {
      setCurrentPage((p) => Math.max(p - 1, 1));
      dispatch(updateOffset((currentPage - 2) * pageSize));
    }
  };

  const visibleResult = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return pokeFinalResult?.slice(start, start + pageSize);
  }, [pokeFinalResult, currentPage]);

  const resetTablePagination = () => {
    dispatch(updateOffset(0));
    dispatch(updatePagination(10));
  }

  const handlePokeQuery = (data: string) => {
    setPokeQuery(data);
    setCurrentPage(1);
    dispatch(updateOffset(0));

    if (data?.trim()?.length > 0) {
      setPageSize(1000);
      params.set('query', data);
    } else {
      setPageSize(userData?.currentPagination);
      params.delete('query');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  const showFooter = !pokeQuery;

  useEffect(() => {
    setPageSize(userData?.currentPagination);
    setCurrentPage(1);
  }, [userData?.currentPagination]);

  useEffect(() => {
    return () => {
      resetTablePagination();
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center w-full bg-zinc-50 font-sans">
      <div className="w-full h-full">
        <SearchBar placeholder="Search for your pokemon..." query={pokeQuery} setQuery={handlePokeQuery} />
        {pokeResult?.length > 0 ? (
          <TableComponent
            currentPage={currentPage}
            totalPage={totalPages}
            onClickNextButton={() => handleArrowButton(true)}
            onClickPrevButton={() => handleArrowButton(false)}
            showPrevButton={showPrevButton}
            showNextButton={showNextButton}
            page={"poke"}
            data={visibleResult}
            showFooter={showFooter}
          />
        ) : <LoadingSkeleton />}
      </div>
    </div>
  );
}
