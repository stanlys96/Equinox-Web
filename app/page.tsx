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
  const [currentPage, setCurrentPage] = useState(Number(params?.get("page") || 1));
  const [pageSize, setPageSize] = useState(Number(params?.get("pagination") || 10) || userData?.currentPagination);
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
      const nextPage = Math.min(currentPage + 1, totalPages);
      params.set("page", nextPage?.toString());
      dispatch(updateOffset(currentPage * pageSize));
      setCurrentPage(nextPage);
    } else {
      const previousPage = Math.max(currentPage - 1, 1);
      setCurrentPage(previousPage);
      params.set("page", previousPage?.toString());
      dispatch(updateOffset((currentPage - 2) * pageSize));
    }
    params.set("pagination", pageSize?.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
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
      setPageSize(Number(params?.get("pagination")) || 10);
      setCurrentPage(Number(params?.get("page")) || 1);
      params.delete('query');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  const showFooter = !pokeQuery;

  useEffect(() => {
    setPageSize(Number(params?.get("pagination")) || 10);
    setCurrentPage(Number(params?.get("page")) || 1);
  }, [params?.get("pagination"), params?.get("page")]);

  useEffect(() => {
    dispatch(updateOffset((currentPage - 1) * pageSize));
  }, [currentPage, pageSize]);

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
