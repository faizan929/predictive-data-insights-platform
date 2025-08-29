import openai
import pandas as pd
import traceback
import os

#### ### DEBUG HERE

# openai.api_key = os.getenv('OPENAI_API_KEY')

# if not openai.api_key:
#     raise ValueError("OpenAI API key not found")

def query_dataframe(df: pd.DataFrame, q: str):

    prompt = f"""  This is a 
          Question: "{q}"
          """       


   


    try:
        response = openai.ChatCompletion.create(
            model = "gpt-4",
            messages =  [{ "role" : "user", "content": prompt}],
            temperature = 0 
        )

        code = response["choices"][0]["message"]["content"].strip()


    
        local_vars = {"df": df}
        exec(code, {}, local_vars)


        result = local_vars.get("result", None)
        if result is None:
            return {
                "error": "LLM did not return a valid result"
            }
        
        if isinstance(result, pd.DataFrame):
            return result.head(10).to_dict(orient = "records")

        elif isinstance(result, (int, float, str, list, dict)):
            return str(result)
        else:
            return str(result)
        

    except Exception as e:
        return {
            "error": str(e),
            "trace": traceback.format_exec(),
            "generated_code": code,
        }