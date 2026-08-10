import json
import re
import shutil
from pathlib import Path

import pandas as pd


ROOT = Path(__file__).resolve().parent.parent
TAXONOMY_PATH = ROOT / "data" / "taxonomy.json"


def load_taxonomy():
    return json.loads(TAXONOMY_PATH.read_text(encoding="utf-8"))["sections"]


def heading_anchor(value):
    return re.sub(r"[^a-z0-9]+", "-", value.casefold()).strip("-")


def convert_csv_to_md(
    csv_file_path,
    mdFile,
    header,
    only_llm_related=False,
    analysis_path=None,
):
    df_paper_info = pd.read_csv(
        csv_file_path,
        sep=",",
        encoding="utf-8",
        keep_default_na=False,
    )
    df_paper_info = df_paper_info.sort_values(
        by=["year", "publisher", "type", "title"],
        ascending=[False, True, True, True],
    )
    if only_llm_related:
        df_paper_info = df_paper_info[df_paper_info["is_llm_related"] == 1]

    taxonomy = load_taxonomy()

    shutil.copy(header, mdFile)
    with open(mdFile, "a", encoding="utf-8") as file:
        if analysis_path:
            file.write("\n")
            file.write(Path(analysis_path).read_text(encoding="utf-8").rstrip())
            file.write("\n\n")

        file.write("<table>\n")
        for section_id, section in enumerate(taxonomy, start=1):
            section_name = section["name"]
            section_rows = df_paper_info[df_paper_info["section"] == section_name]
            if section_rows.empty:
                continue
            file.write(
                f'<tr><td colspan="2"><strong><a href="#{heading_anchor(section_name)}">'
                f"{section_id}. {section_name}</a></strong></td></tr>\n"
            )
            for group_id, group in enumerate(section["groups"], start=1):
                group_name = group["name"]
                group_rows = section_rows[section_rows["group"] == group_name]
                if group_rows.empty:
                    continue
                file.write(
                    f'<tr><td colspan="2">&emsp;<a href="#{heading_anchor(group_name)}">'
                    f"{section_id}.{group_id}. {group_name}</a></td></tr>\n"
                )
                populated_categories = [
                    category
                    for category in group["categories"]
                    if not group_rows[group_rows["category"] == category].empty
                ]
                for category_offset in range(0, len(populated_categories), 2):
                    file.write("<tr>\n")
                    for category_name in populated_categories[
                        category_offset : category_offset + 2
                    ]:
                        category_id = group["categories"].index(category_name) + 1
                        file.write(
                            f'<td>&emsp;&emsp;<a href="#{heading_anchor(category_name)}">'
                            f"{section_id}.{group_id}.{category_id}. {category_name}</a></td>\n"
                        )
                    if category_offset + 1 >= len(populated_categories):
                        file.write("<td></td>\n")
                    file.write("</tr>\n")
        file.write("</table>\n\n")

        def write_one_paper(file, paper, paper_id_count):
            if only_llm_related and paper["is_llm_related"] == 1:
                file.writelines(f"{paper_id_count}. :sparkles: **{paper['title']}**")
            else:
                file.writelines(f"{paper_id_count}. **{paper['title']}**")
            file.write("\n\n")
            file.writelines(f"    *{paper['authors']}*")
            file.write("\n\n")
            file.writelines(
                f"    {paper['publisher']}, {paper['year']}. "
                f"[`{paper['type']}`]({paper['link']})"
            )
            if isinstance(paper["code"], str) and len(paper["code"]) > 0:
                file.writelines(f", [`code`]({paper['code']})")
            file.write("\n\n")

        for section in taxonomy:
            section_name = section["name"]
            section_rows = df_paper_info[df_paper_info["section"] == section_name]
            if section_rows.empty:
                continue
            file.write(f"## [{section_name}](#content)\n\n")
            for group in section["groups"]:
                group_name = group["name"]
                group_rows = section_rows[section_rows["group"] == group_name]
                if group_rows.empty:
                    continue
                file.write(f"### [{group_name}](#content)\n\n")
                if not group["categories"]:
                    for paper_id, (_, paper) in enumerate(group_rows.iterrows(), start=1):
                        write_one_paper(file, paper, paper_id)
                    continue

                for category_name in group["categories"]:
                    category_rows = group_rows[group_rows["category"] == category_name]
                    if category_rows.empty:
                        continue
                    file.write(f"#### [{category_name}](#content)\n\n")
                    for paper_id, (_, paper) in enumerate(
                        category_rows.iterrows(), start=1
                    ):
                        write_one_paper(file, paper, paper_id)
            file.write("\n")


if __name__ == "__main__":
    convert_csv_to_md(
        ROOT / "data" / "papers.csv",
        ROOT / "README.md",
        ROOT / "data" / "header.md",
        only_llm_related=False,
        analysis_path=ROOT / "visualization" / "analysis.md",
    )
    convert_csv_to_md(
        ROOT / "data" / "papers.csv",
        ROOT / "LLM4EDU.md",
        ROOT / "data" / "header.md",
        only_llm_related=True,
    )
