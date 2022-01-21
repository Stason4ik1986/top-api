import { CATEGORY_URL } from './sitemap.constants';
import { Controller, Get, Header } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { subDays, format } from 'date-fns';
import { Builder } from 'xml2js';

import { TopPageService } from 'src/top-page/top-page.service';

@Controller('sitemap')
export class SitemapController {
  domain: string;

  constructor(
    private readonly _configService: ConfigService,
    private readonly _topPageService: TopPageService,
  ) {
    this.domain = this._configService.get('DOMAIN') ?? '';
  }

  @Get('xml')
  @Header('Content-Type', 'text/xml')
  async sitemap() {
    const formatString = 'yyyy-MM-dd\'T\'HH:mm:00.000xx';
    const builder = new Builder({
      xmldec: { version: '1.0', encoding: 'UTF-8' }
    });
    let res = [
      {
        loc: this.domain,
        lastmod: format(subDays(new Date(), 1), formatString),
        changefreq: 'daily',
        priority: '1',
      },
      {
        loc: `${this.domain}/courses`,
        lastmod: format(subDays(new Date(), 1), formatString),
        changefreq: 'daily',
        priority: '1',
      }
    ];
    const pages = await this._topPageService.findAll();
    if (pages) {
      res = res.concat(
        pages.map(page => {
          return {
            loc: `${this.domain}${CATEGORY_URL[page.firstCategory]}/${page.alias}`,
            lastmod: format(page.updatedAt ?? new Date(), formatString),
            changefreq: 'weekly',
            priority: '0.7',
          }
        })
      );
    }
    return builder.buildObject({
      urlset: {
        $: {
          xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
        },
        url: res,
      }
    });
  }
}
