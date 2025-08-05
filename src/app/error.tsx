"use client";

import { Button, Result } from "antd";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    reset();
  }, [error, reset]);

  return (
    <div className="tw:min-h-full tw:grid tw:items-center tw:justify-center">
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={
          <Button type="primary">
            <Link href="/">Back To Home</Link>
          </Button>
        }
      />
    </div>
  );
}
