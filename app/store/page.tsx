"use client";
import { AddAssetButton, LoadingSkeleton, SearchBar, TableComponent } from "@/components";
import { filterDataByQuery, mapAndSortStoreData } from "@/utils/helper";
import { useEffect, useMemo, useState } from "react";
import { updateOffset, updatePagination, updateStoreData } from "@/store/slice/userSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(userData?.currentPagination);
  const [storeQuery, setStoreQuery] = useState(params?.get("query") || "");
  const storeResult = mapAndSortStoreData(userData?.storeData);
  const finalStoreResult = storeQuery ? filterDataByQuery(storeResult, storeQuery) : storeResult;
  const visibleResult = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return finalStoreResult?.slice(start, start + pageSize);
  }, [finalStoreResult, currentPage]);

  const totalPages = Math.ceil(storeResult?.length / pageSize);

  const showPrevButton = currentPage !== 1;
  const showNextButton = currentPage !== totalPages;

  const showFooter = !storeQuery;

  const handleArrowButton = (next: boolean) => {
    if (next) {
      dispatch(updateOffset(currentPage * pageSize));
      setCurrentPage((p) => Math.min(p + 1, totalPages));
    } else {
      setCurrentPage((p) => Math.max(p - 1, 1));
      dispatch(updateOffset((currentPage - 2) * pageSize));
    }
  };

  const handleQuery = (data: string) => {
    setStoreQuery(data);
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

  useEffect(() => {
    setPageSize(userData?.currentPagination);
    setCurrentPage(1);
  }, [userData?.currentPagination]);

  useEffect(() => {
    return () => {
      dispatch(updateOffset(0));
      dispatch(updatePagination(10));
    }
  }, []);
  return (
    <div className="flex min-h-screen items-center justify-center w-full bg-zinc-50 font-sans">
      <div className="w-full h-full">
        <SearchBar placeholder="Search for your product..." query={storeQuery} setQuery={handleQuery} />
        <div className="w-full justify-center flex items-center">
          <AddAssetButton onClick={() => router.push("/store/form")} />
        </div>
        {storeResult?.length > 0 ? (
          <TableComponent
            currentPage={currentPage}
            totalPage={totalPages}
            onClickNextButton={() => handleArrowButton(true)}
            onClickPrevButton={() => handleArrowButton(false)}
            showPrevButton={showPrevButton}
            showNextButton={showNextButton}
            page={"store"}
            data={visibleResult}
            showFooter={showFooter}
          />
        ) : <LoadingSkeleton />}
      </div>
    </div>
  );
}
