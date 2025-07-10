import pandas as pd 

file_path = r'C:\Users\hp\Desktop\ffff\consomation emagenaire.xlsx'
# hadi ghir variabel fiha lblasa fin kayn l'file excel li bghina ndirou fih l'opération
df = pd.read_excel(file_path)
# hna kanqra l'file excel li kayn f l'path li 3tina
df['D'] = df.apply(lambda row: 'Succès' if row['B'] > row['C'] else 'Stop', axis=1)
# hna kanzidou colonne D li kat3ti 'Succès' ila kanat valeur 
df.to_excel(file_path, index=False)  
# hna kanktbou l'file excel b l'index False bach ma ykhdemch l'index
# li kayn f df

print("✅ Résultat écrit dans la colonne D avec succès !")
# hna kan3ti message li kayn l'operation tamamet b l'khir
