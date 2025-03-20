import pandas as pd
import openai
from flask import Flask, request, jsonify
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.text_splitter import CharacterTextSplitter
import os

# Load Excel data
excel_file = "data.xlsx"
df = pd.read_excel(excel_file)

def prepare_text_data(df):
    """Convert DataFrame content into searchable text format."""
    text_data = ""
    for index, row in df.iterrows():
        text_data += f"NGO: {row.get('NGO Name', 'N/A')}, Website: {row.get('Website', 'N/A')}, Location: {row.get('Location', 'N/A')}, Details: {row.get('Description', 'N/A')}\n"
    return text_data

# Convert Excel data to text
text_data = prepare_text_data(df)

# Split text into chunks for vector search
text_splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
texts = text_splitter.split_text(text_data)

# Initialize OpenAI API
openai.api_key = "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"
embeddings = OpenAIEmbeddings()

# Create vector database
vector_store = FAISS.from_texts(texts, embeddings)
retriever = vector_store.as_retriever()

# LLM Chat model
llm = ChatOpenAI(model_name="gpt-4", temperature=0.2)
qa_chain = RetrievalQA(llm=llm, retriever=retriever)

# Flask API
app = Flask(__name__)

@app.route("/chat", methods=["POST"])
def chat():
    """Handle user queries."""
    user_query = request.json.get("query")
    if not user_query:
        return jsonify({"error": "No query provided"}), 400
    
    response = qa_chain.run(user_query)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
