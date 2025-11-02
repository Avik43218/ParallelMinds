import pandas as pd
import sys

def get_top_k(scores_csv, k=10, output_file="top_k.csv"):
    
    df = pd.read_csv(scores_csv)
    
    df_sorted = df.sort_values(by="similarity", ascending=False)
    
    top_k = df_sorted.head(k)

    top_k.to_csv(output_file, index=False)
    
    print(f"Top {k} applicants saved to {output_file}\n")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python top_k_sort.py <scores.csv>")
        sys.exit(1)

    scores_csv = sys.argv[1]
    k = 100
    get_top_k(scores_csv, k)
