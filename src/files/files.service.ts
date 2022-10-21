import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
// import * as fileType from 'file-type';
import { existsSync, mkdirSync } from 'node:fs';
import { writeFile, rm } from 'node:fs/promises';
import * as path from 'path';

@Injectable()
export class FilesService {
  signatures = {
    JVBERi0: 'application/pdf',
    R0lGODdh: 'image/gif',
    R0lGODlh: 'image/gif',
    iVBORw0KGgo: 'image/png',
    '/9j/': 'image/jpg',
  };
  private getType(b64: string): string {
    for (const s in this.signatures) {
      if (b64.indexOf(s) === 0) {
        return this.signatures[s];
      }
    }
  }

  async createFile(file: Express.Multer.File, userId: string): Promise<string> {
    try {
      const fileName = userId + path.extname(file.originalname);
      const filePath = path.resolve(__dirname, '..', 'static');
      if (!existsSync(filePath)) {
        mkdirSync(filePath, { recursive: true });
      }
      await writeFile(path.join(filePath, fileName), file.buffer);
      return file.buffer.toString('base64');
    } catch (error) {
      throw new HttpException(
        'Something went wrong while uploading the file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeFile(userId: string, base: string) {
    const filePath = path.resolve(__dirname, '..', 'static');
    const ext = '.' + this.getType(base).split('/')[1];
    const fileName = userId + ext;
    return rm(path.join(filePath, fileName));
  }
}
