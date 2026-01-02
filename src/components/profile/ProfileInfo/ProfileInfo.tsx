import { profileApi } from "@/apis/profile.api";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { useNotification } from "@/providers/NotificationProvider";
import { updateUser } from "@/store/slices/authSlice";
import { checkBeforeUpload, getAvatarUrl, getBase64 } from "@/utils/utils";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Avatar, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import type { RcFile } from "antd/lib/upload";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const ProfileInfo = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const notification = useNotification();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(getAvatarUrl(user?.avatar));
  const [uploading, setUploading] = useState(false);

  const handleUploadAvatar = async (file: File) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file as RcFile);
      const response = await profileApi.updateAvatar(formData);
      if (response.code === 200) {
        dispatch(updateUser({ avatar: response.data.avatar }));
        const base64 = await getBase64(file);
        setAvatarUrl(base64);
        notification.success({
          title: t("common.success"),
          description: t("common.updateSuccess")
        });
      }
    } catch (error: any) {
      notification.error({
        title: t("common.error"),
        description: error?.message || t("common.updateFailed")
      });
    } finally {
      setUploading(false);
    }
  };

  const uploadProps: UploadProps = {
    maxCount: 1,
    showUploadList: false,
    accept: "image/*",
    beforeUpload: async (file) => {
      const result = checkBeforeUpload(file, ["image/jpeg", "image/png"], 30, notification);
      if (result === false) {
        const preview = await getBase64(file);
        setAvatarUrl(preview);
        handleUploadAvatar(file);
      }
      return result;
    },
    onChange(info) {
      if (info.file.status === "removed") {
        setAvatarUrl(user?.avatar);
      }
    }
  };
  return (
    <>
      <div className="flex flex-col items-center mb-6">
        <ImgCrop rotationSlider aspect={1 / 1} cropShape="round">
          <Upload {...uploadProps} showUploadList={false} disabled={uploading}>
            <div className="relative group cursor-pointer w-40 h-40 rounded-full overflow-hidden border-2 border-gray-100 hover:border-blue-400 transition-all duration-300">
              <Avatar size={160} icon={<UserOutlined />} src={avatarUrl} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {uploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                ) : (
                  <UploadOutlined style={{ color: "white" }} className="text-2xl" />
                )}
              </div>
            </div>
          </Upload>
        </ImgCrop>
        <h2 className="text-xl font-semibold mt-4">{user?.ho_va_ten || "Admin User"}</h2>
        <p className="text-gray-500">{user?.email}</p>
        <p className="text-sm text-gray-400 mt-2">
          {t("user.role")}: {user?.ma_vai_tro || "Admin"}
        </p>
      </div>
    </>
  );
};

export default ProfileInfo;
