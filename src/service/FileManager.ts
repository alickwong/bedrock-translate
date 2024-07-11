import * as fs from "fs";
import * as path from "path";

export class FileManager {
  async getAllFiles(dirPath: string): Promise<string[]> {
    let files: string[] = [];

    const items = await fs.promises.readdir(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = await fs.promises.stat(itemPath);

      if (stat.isDirectory()) {
        const subDirFiles = await this.getAllFiles(itemPath);
        files = files.concat(subDirFiles);
      } else {
        files.push(itemPath);
      }
    }

    return files;
  }
}