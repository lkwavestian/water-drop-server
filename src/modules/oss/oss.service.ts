import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as OSS from 'ali-oss';
import { OSSType } from './dto/oss.type';

@Injectable()
export class OSSService {
  /**
   * @description 获取 OSS 上传签名
   * @see https://help.aliyun.com/document_detail/31926.html
   * @return {*}  {Promise<OSSType>}
   * @memberof OSSService
   */
  async getSignature(): Promise<OSSType> {
    const config = {
      accessKeyId: 'LTAI5t6D9W6Arg5ZwEYfWqjG',
      accessKeySecret: '8YNGXLtXXTOIR6pp7P4kH963FmTOnt',
      bucket: 'water-drop-assets',
      dir: 'images/',
    };

    const client = new OSS(config);

    const date = new Date();
    date.setDate(date.getDate() + 1);
    const policy = {
      expiration: date.toISOString(), // 请求有效期
      conditions: [
        ['content-length-range', 0, 1048576000], // 设置上传文件的大小限制
      ],
    };
    //签名
    const formData = await client.calculatePostSignature(policy);
    //返回参数
    const params = {
      expire: dayjs().add(1, 'days').unix().toString(),
      policy: formData.policy,
      signature: formData.Signature,
      accessId: formData.OSSAccessKeyId,
    };

    return params;
  }
}