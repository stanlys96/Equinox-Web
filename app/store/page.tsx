"use client";
import { AddAssetButton, LoadingSkeleton, SearchBar, TableComponent } from "@/components";
import { filterDataByQuery, LOCAL_STORAGE_PRODUCTS, mapAndSortStoreData } from "@/utils/helper";
import { useEffect, useMemo, useState } from "react";
import { deleteSingleStoreData, updateOffset, updatePagination, updateStoreData } from "@/store/slice/userSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import axios from "axios";
import { STORE_BASE_URL } from "@/utils/api";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(Number(params?.get("page") || 1));
  const [pageSize, setPageSize] = useState(Number(params?.get("pagination") || 10) || userData?.currentPagination);
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

  const handlePaginationQuery = () => {
    setPageSize(Number(params?.get("pagination")) || 10);
    setCurrentPage(Number(params?.get("page")) || 1);
  }

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

  const handleQuery = (data: string) => {
    setStoreQuery(data);
    setCurrentPage(1);
    dispatch(updateOffset(0));

    if (data?.trim()?.length > 0) {
      setPageSize(1000);
      params.set('query', data);
    } else {
      handlePaginationQuery();
      params.delete('query');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  const handleDeleteProduct = (id: string) => {
    Swal.fire({
      title: "Are you sure you want to delete this product?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async(result) => {
      if (result.isConfirmed) {
        await axios.delete(`${STORE_BASE_URL}/${id}`);
        dispatch(deleteSingleStoreData(id?.toString()));
        const newStoreData = userData?.storeData?.filter((data) => data?.id?.toString() !== id?.toString());
        localStorage.setItem(LOCAL_STORAGE_PRODUCTS, JSON.stringify(newStoreData));
        Swal.fire({
          title: "Deleted!",
          text: "Your product has been deleted.",
          icon: "success"
        });
      }
    });
  }

  useEffect(() => {
    handlePaginationQuery();
  }, [params?.get("pagination"), params?.get("page")]);

  useEffect(() => {
    dispatch(updateOffset((currentPage - 1) * pageSize));
  }, [currentPage, pageSize]);

  useEffect(() => {
    return () => {
      dispatch(updateOffset(0));
      dispatch(updatePagination(10));
    }
  }, []);

  useEffect(() => {
    if (Boolean(params?.get("query"))) {
      setCurrentPage(1);
      setPageSize(1000);
    } else {
      handlePaginationQuery();
    }
  }, [params?.get("query")]);

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
            onClickDeleteButton={handleDeleteProduct}
          />
        ) : <LoadingSkeleton />}
      </div>
    </div>
  );
}
