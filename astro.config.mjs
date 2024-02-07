import { defineConfig } from 'astro/config';
//npm install unist-util-visit
import { visit } from 'unist-util-visit';
import mdx from "@astrojs/mdx";
import embeds from 'astro-embed/integration';

function fixRelativeLinksFromObsidianToAstro(options) {
  function visitor(node) {
    if (node.url.startsWith('http') || node.url.startsWith('/images/')) {
      return;
    }
    if (!node.url.startsWith('/')) {
      node.url = '../../../assets/' + node.url;
    }   
  }
  function transform(tree) {
    visit(tree, 'image', visitor);
  }
  return transform;
}


// https://astro.build/config
export default defineConfig({
  site: "https://peppy-marshmallow-841b1d.netlify.app",
  markdown: {
    remarkPlugins: [[fixRelativeLinksFromObsidianToAstro, {}]]
  },
  integrations: [embeds(), mdx()]
});