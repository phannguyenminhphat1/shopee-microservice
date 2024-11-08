import { Global, Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Global()
@Module({
  imports: [
    ElasticsearchModule.register({
      node: 'https://localhost:9200',
      auth: {
        username: 'elastic',
        password: 'LFn7xE3MEC1hnOjSuYZ_',
      },
      tls: {
        rejectUnauthorized: false,
      },
    }),
  ],
  exports: [ElasticsearchModule],
})
export class ElasticModule {}
