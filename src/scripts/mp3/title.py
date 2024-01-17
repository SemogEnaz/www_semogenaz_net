import requests
from bs4 import BeautifulSoup

url = 'https://www.youtube.com/watch?v=eFNWKrmH57E'
html = requests.get(url)
soup = BeautifulSoup(html.content, 'lxml')

meta_tag = soup.find('meta', attrs={'name': 'title'})
if (meta_tag == None): print('')

title = meta_tag.get('content')
print(title)