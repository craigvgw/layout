import { Layout } from '../Layout';
import { Containers, Content, LayoutStyles } from '../utils/types';
import { Container } from '@pixi/display';
import { Text } from '@pixi/text';

/** Controls all {@link Layout} children sizing. */
export class ContentController
{
    private layout: Layout;

    children: Containers = [];

    /**
     * Creates all instances and manages configs
     * @param {Layout} layout - Layout instance
     * @param content - Content of the layout
     * @param globalStyles - Global styles for layout and it's children
     */
    constructor(layout: Layout, content?: Content, globalStyles?: LayoutStyles)
    {
        this.layout = layout;

        this.createContent(content, globalStyles);
    }

    private createContent(content?: Content, parentGlobalStyles?: LayoutStyles)
    {
        if (!content) return;

        if (typeof content === 'string')
        {
            const { textStyle: textStyles } = this.layout.style;

            const text = new Text(content, textStyles);

            this.children.push(text);
            this.layout.addChild(text);
        }
        else if (content instanceof Container)
        {
            this.children.push(content);
            this.layout.addChild(content);
        }
        else if (Array.isArray(content))
        {
            content.forEach((content) =>
            {
                this.createContent(content, parentGlobalStyles);
            });
        }
        else if (typeof content === 'object')
        {
            if (content.id)
            {
                // we consider this as Layout

                if (parentGlobalStyles)
                {
                    if (content.globalStyles)
                    {
                        content.globalStyles = {
                            ...parentGlobalStyles,
                            ...content.globalStyles
                        };
                    }
                    else
                    {
                        content.globalStyles = { ...parentGlobalStyles };
                    }
                }

                const layout = new Layout(content);

                this.children.push(layout);
                this.layout.addChild(layout);
            }
            else
            {
                throw new Error('Invalid content');
            }
        }
    }

    /**
     * Resizes all children.
     * @param width
     * @param height
     */
    resize(width: number, height: number)
    {
        this.layout.children.forEach((child) =>
        {
            if (child instanceof Layout)
            {
                child.resize(width, height);
            }
        });
    }
}
