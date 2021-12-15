import { format } from "date-fns";
import Head from "next/head";
import { renderMetaTags, useQuerySubscription } from "react-datocms";
import Container from "@/components/container";
import Header from "@/components/header";
import Layout from "@/components/layout";
import MoreStories from "@/components/more-stories";
import PostBody from "@/components/post-body";
import PostHeader from "@/components/post-header";
import SectionSeparator from "@/components/section-separator";
import { request } from "@/lib/datocms";
import { metaTagsFragment, responsiveImageFragment } from "@/lib/fragments";
import LanguageBar from "@/components/language-bar";
import PostTitle from "@/components/post-title";

export async function getStaticPaths({ locales }) {
    const data = await request(
        {
            query: `
            {
                allCategories {
                  slug
                  _allSlugLocales {
                    locale
                    value
                  }
                }
              }
            `
        });

    const pathsArray = [];
    data?.allCategories?.map((category) => {
        category?._allSlugLocales.map(slugs => {
            pathsArray.push({
                params: { category: slugs.value },
                locale: slugs.locale,
            });
        })
    });

    return {
        paths: pathsArray,
        fallback: false,
    };
}

export async function getStaticProps({ params, preview = false, locale }) {
    const formattedLocale = locale.split("-")[0];
    console.log(params, 'params')
    const graphqlRequest = {
        query: `
        query CategoryBySlug($slug: String) {
          site: _site {
            favicon: faviconMetaTags {
              ...metaTagsFragment
            }
          }
          category(locale: ${formattedLocale}, filter: {slug: {eq: $slug}}) {
            name
            slug
            description
            _firstPublishedAt
            _allSlugLocales {
                locale
                value
              }
          }
        }
  
        ${metaTagsFragment}
      `,
        preview,
        variables: {
            slug: params.category,
        },
    };

    return {
        props: {
            subscription: preview
                ? {
                    ...graphqlRequest,
                    initialData: await request(graphqlRequest),
                    token: process.env.NEXT_EXAMPLE_CMS_DATOCMS_API_TOKEN,
                }
                : {
                    enabled: false,
                    initialData: await request(graphqlRequest),
                },
        },
    };
}

export default function Category({ subscription, preview }) {

    const {
        data: { site, category },
    } = useQuerySubscription(subscription);

    const metaTags = category?.seo?.concat(site.favicon);

    return (
        <>
            <Layout preview={preview}>
                <Container>
                    <LanguageBar />

                    <Header />
                    <article>
                        <PostTitle>{category.name}</PostTitle>
                        <div className="mx-auto">
                            <div className="prose prose-lg prose-blue max-w-none">
                                <p>{category.description}</p>
                            </div>
                        </div>
                    </article>
                </Container>
            </Layout>
        </>
    );
}
