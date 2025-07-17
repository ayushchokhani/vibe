
import { Client } from "./client";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";



export default async function Home() {

  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.hello.queryOptions({text: "john prefetch"}))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading...</p>}>
        <Client />
      </Suspense>
    </HydrationBoundary>
  )
}
