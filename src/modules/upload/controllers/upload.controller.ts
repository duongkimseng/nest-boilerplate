import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { ApiFile, ApiFiles } from '@infrastructure/decorators';
import JwtAccessGuard from '@infrastructure/guards/jwt-access.guard';
import BlobService from '@shared/azure/blob.service';

@ApiTags('Upload')
@Controller('upload')
@ApiBearerAuth()
export default class UploadController {
  constructor(private readonly blobSvc: BlobService) {}

  @Post('file')
  @ApiConsumes('multipart/form-data')
  @ApiFile('file')
  @UseGuards(JwtAccessGuard)
  async uploadFile(@Req() req: FastifyRequest): Promise<boolean> {
    const uploadedFile = await req.file();
    const result = await this.blobSvc.uploadBlobAsync('test', uploadedFile);

    return result;
  }

  @Post('files')
  @ApiConsumes('multipart/form-data')
  @ApiFiles('files')
  @UseGuards(JwtAccessGuard)
  async uploadFiles(@Req() req: FastifyRequest): Promise<boolean> {
    // NOTE: This is not error. this is in official docs with `fasitfy-multipart`
    const uploadedFiles = await req.files();
    const result = await this.blobSvc.uploadBlobsAsync('test', uploadedFiles);

    return result;
  }
}
