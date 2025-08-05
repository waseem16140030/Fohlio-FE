import { Button, Result } from "antd";
import Link from "next/link";

export default async function NotFoundPage() {
  return (
    <div className="tw:min-h-full tw:grid tw:items-center tw:justify-center">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist. Looks like you lost your way home."
        extra={
          <Button type="primary">
            <Link href="/">Back To Home</Link>
          </Button>
        }
      />
    </div>
  );
}
