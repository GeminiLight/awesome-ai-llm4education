import csv
import os
import copy
import shutil
import pandas as pd


def convert_csv_to_md(csv_file_path, mdFile, header):
    df_paper_info = pd.read_csv(csv_file_path, sep=',', encoding='utf-8')
    df_paper_info['category'] = df_paper_info['category'].apply(lambda x: x.split(';'))
    df_paper_info = df_paper_info.explode('category')
    group_list = df_paper_info['group'].unique().tolist()
    df_paper_info = df_paper_info.sort_values(by=['category', 'year', 'publisher', 'type'], ascending=[True, False, True, True])

    shutil.copy(header, mdFile)
    # Write the table of content
    with open(mdFile, "a", encoding='utf-8') as file:
        file.writelines('<table>\n\n')
        for group_id, group_name in enumerate(group_list):
            df_paper_info_of_group = df_paper_info[df_paper_info['group'] == group_name]
            category_list_of_group = df_paper_info_of_group['category'].unique().tolist()
            group_name_for_herf = group_name.replace(" ", "-").replace("&", "").lower()
            file.writelines('<tr>\n')
            file.writelines(f'<tr><td colspan="2"><a href="#{group_name_for_herf}">{group_id+1}. {group_name.title()}</a></td>\n')
            # No need to write the category table if there is only one category in the group
            if len(category_list_of_group) == 1 and category_list_of_group[0] == group_name:
                continue
            for category_id, category_name in enumerate(category_list_of_group):
                category_name_for_herf = category_name.replace(" ", "-").replace("&", "").lower()
                if category_id % 2 == 0: file.writelines('<tr>\n')
                file.writelines(f'\t<td>&emsp;<a href=#{category_name_for_herf}>{group_id+1}.{category_id+1} {category_name}</a></td>\n')
                if category_id % 2 == 1: file.writelines('</tr>\n')
            if len(category_list_of_group) % 1 == 0:
                file.writelines(f'\t<td></td>\n')
                file.writelines('</tr>\n')
        file.writelines('</table>\n\n')

        def write_one_paper(file, paper, paper_id_count):
            if paper['is_llm_related'] == 1:
                file.writelines(f"{paper_id_count}. :sparkles: **{paper['title']}**")
            else:
                file.writelines(f"{paper_id_count}. **{paper['title']}**")
            file.write('\n\n')
            file.writelines(f"    *{paper['authors']}*")
            file.write('\n\n')
            file.writelines(f"    {paper['publisher']}, {paper['year']}. [`{paper['type']}`]({paper['link']})")
            file.write('\n\n')
            if isinstance(paper['code'], str) and len(paper['code']) > 0:
                file.writelines(f", [`code`]({paper['code']})")
                file.write('\n\n')

        # Write paper info
        for group_id, group_name in enumerate(group_list):
            file.writelines(f"## [{group_name.title()}](#content)\n\n")
            df_paper_info_of_group = df_paper_info[df_paper_info['group'] == group_name]
            category_list_of_group = df_paper_info_of_group['category'].unique().tolist()
            # Case 1: only one category in the group
            if len(category_list_of_group) == 1 and category_list_of_group[0] == group_name:
                df_paper_info_category = df_paper_info_of_group[df_paper_info_of_group['category'] == group_name]
                for paper_id, (paper_index, paper) in enumerate(df_paper_info_category.iterrows()):
                    write_one_paper(file, paper, paper_id+1)
                file.write('\n\n')
                continue
            # Case 2: multiple categories in the group
            for category_id, category_name in enumerate(category_list_of_group):
                df_paper_info_category = df_paper_info_of_group[df_paper_info_of_group['category'] == category_name]
                if len(df_paper_info_category) == 0: continue
                file.writelines(f"### [{category_name}](#content)\n\n")
                for paper_id, (paper_index, paper) in enumerate(df_paper_info_category.iterrows()):
                    write_one_paper(file, paper, paper_id+1)
            file.write('\n\n')


# def visualize(csvFile):
#     import numpy as np
#     import pandas as pd
#     import matplotlib.pyplot as plt
#     from wordcloud import WordCloud
#     import plotly.express as px
#     import plotly.graph_objects as go
    
    
#     if theme == 'dark':
#         plt.style.use('dark_background')
#         plotly_template = 'plotly_dark'
#     else:
#         plt.style.use('default')

#     df_papers = pd.read_csv(csvFile)
#     width = 800
#     height = 800
#     top_conference_list = ['KDD', 'WWW', 'SIGIR', 'CCS', 'CHI', 'MM', 'NeurIPS', 'CSCW']

#     # Figure 1: Annual Count Trend
#     df_paper_groupby_year_type_for_count = df_papers.groupby(["year", "type"]).count().reset_index().rename({'title': 'count'}, axis=1)
#     df_paper_groupby_year_type_for_count = df_paper_groupby_year_type_for_count[['year', 'type', 'count']]
#     df_paper_groupby_year_type_for_count['year'] = df_paper_groupby_year_type_for_count['year'].astype(str)
#     df_paper_groupby_year_type_for_count = df_paper_groupby_year_type_for_count.pivot(index='year', columns='type', values='count').fillna(0).astype(int)
#     df_paper_groupby_year_type_for_count = df_paper_groupby_year_type_for_count.reset_index()
#     publication_type_list = df_papers.type.unique().tolist()

#     fig = px.bar(df_paper_groupby_year_type_for_count, 
#                     x="year", y=publication_type_list, 
#                     title="Annual Count Trend",
#                     color_discrete_sequence=px.colors.sequential.dense[1::2],
#                     width=width, height=height,
#                     template=plotly_template)
#     fig.write_image("../figures/annual_count_trend.svg")

#     # Figure 2: Category Distribution
#     df_papers_groupby_category_for_count = df_papers.groupby(["category"]).count().reset_index().rename({'title': 'count'}, axis=1)
#     fig = px.pie(df_papers_groupby_category_for_count, values='count', names='category', 
#                     title='Category Distribution', 
#                     # color_discrete_sequence= px.colors.sequential.Plasma_r,
#                     # color_discrete_sequence= px.colors.sequential.Plasma_r,
#                     width=width, height=height,
#                     template=plotly_template)
#     fig.update_traces(textposition='inside', textinfo='label+percent+value')
#     fig.write_image("../figures/category_distribution.svg")

#     # Figure 3: Publisher Distribution
#     def get_publisher_type(paper_info):
#         if paper_info['type'] != 'conference':
#             return paper_info['type'].capitalize()
#         else:
#             if paper_info['publisher'] in top_conference_list:
#                 return 'Top Conference'
#             else:
#                 return 'Other Conference'
                
#     df_papers_groupby_publisher_for_count = df_papers.groupby(["publisher"]).agg({'title': 'count', 'type': 'first'}).reset_index().rename({'title': 'count'}, axis=1)
#     df_papers_groupby_publisher_for_count['publisher_type'] = df_papers_groupby_publisher_for_count.apply(get_publisher_type, axis=1)
#     df_papers_groupby_publisher_type_for_count = df_papers_groupby_publisher_for_count.groupby(["publisher_type"]).agg({'count': 'sum'}).reset_index()

#     sunburst_labels = ['NFT']
#     sunburst_parents = ['']
#     sunburst_values = [0]
#     sunburst_labels += df_papers_groupby_publisher_type_for_count['publisher_type'].values.tolist()
#     sunburst_parents += ['NFT'] * len(df_papers_groupby_publisher_type_for_count)
#     sunburst_values += [0] * len(df_papers_groupby_publisher_type_for_count)
#     sunburst_labels += df_papers_groupby_publisher_for_count['publisher'].values.tolist()
#     sunburst_parents += df_papers_groupby_publisher_for_count['publisher_type'].values.tolist()
#     sunburst_values += df_papers_groupby_publisher_for_count['count'].values.tolist()

#     fig =go.Figure(go.Sunburst(
#         labels=sunburst_labels,
#         parents=sunburst_parents,
#         values=sunburst_values,
#     )
#     )
#     fig.update_layout(
#         # margin = dict(t=0, l=0, r=0, b=0), 
#         title="Publisher Distribution",
#         width=width, height=height,
#         template=plotly_template
#         )
#     fig.write_image("../figures/publisher_distribution.svg")

#     # Figure 4: Title Word Cloud
#     title_list = df_papers.title.tolist()
#     sentence = ' '.join(title_list)
#     terms_to_replace = [
#         'NFTs', 'nfts', 'Nfts',
#         'NFT\'s', 'nft\'s', 'Nft\'s',
#         'NFT', 'nft', 'Nft',
#         'Non-fungible', 'non-fungible', 'Non-Fungible',
#         'Tokens', 'tokens',
#         'Token\'s', 'token\'s', 'Tokens\'', 'tokens\'',
#         'Token', 'token', 
#         'Use', 'Using', 'Via'
#     ]
#     for term in terms_to_replace:
#         sentence = sentence.replace(term, '')
#     wc = WordCloud(width=800, height=800).generate(sentence)
#     plt.figure(figsize=(10, 10), dpi=100)
#     plt.imshow(wc, interpolation='bilinear')
#     plt.axis("off")
#     plt.title("Title Word Cloud", fontsize=18)
#     plt.savefig("../figures/title_word_cloud.png", dpi=200)


if __name__ == '__main__':
    # md2csv("../README.md", "../data/papers.csv")
    theme = 'dark'
    convert_csv_to_md("../data/papers.csv", "../README.md", "../data/header.md")
    # visualize("../data/papers.csv")
