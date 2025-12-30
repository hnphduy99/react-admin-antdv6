import type { NotificationContextType } from "@/providers/NotificationProvider";
import { Upload, type InputNumberProps } from "antd";
import type { RcFile } from "antd/lib/upload";

export const formatter: InputNumberProps<number>["formatter"] = (value) => {
  const [start, end] = `${value}`.split(".") || [];
  const v = `${start}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$ ${end ? `${v}.${end}` : `${v}`}`;
};

export const parser: InputNumberProps<number>["parser"] = (value: string | undefined) => {
  return value?.replace(/\$\s?|(,*)/g, "") as unknown as number;
};

/**
 * Kiểm tra file trước khi upload
 * @param file file cần kiểm tra
 * @param typeFile type file cần kiểm tra (ví dụ: ["image/jpeg", "image/png"])
 * @param sizeLimit kích thước giới hạn (MB)
 * @param notification truyền notification để hiển thị thông báo
 * @returns Upload.LIST_IGNORE nếu không hợp lệ, false nếu hợp lệ
 */
export const checkBeforeUpload = (
  file: RcFile,
  typeFile: string[],
  sizeLimit: number,
  notification: NotificationContextType
) => {
  const isTypeFile = typeFile.includes(file.type);
  const isSizeFile = file.size / 1024 / 1024 < sizeLimit;
  if (!isTypeFile) {
    notification.error({
      title: "Error",
      description: `Chỉ có thể upload file ${typeFile.map((type) => type.split("/")[1]).join(", ")}`
    });
    return Upload.LIST_IGNORE;
  }
  if (!isSizeFile) {
    notification.error({
      title: "Error",
      description: `File phải nhỏ hơn ${sizeLimit}MB`
    });
    return Upload.LIST_IGNORE;
  }
  return false;
};

export const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
