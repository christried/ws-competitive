preferred subdomains for localtunnel:

npx localtunnel --port 3000 --subdomain light-walls-cut
npx localtunnel --port 3001 --subdomain chubby-rings-change

start backends (npm run start-rivals + npm run start-versus) first

localtunnel tunnels seem to be very inconsistent, often crash. Might need to restart several times
known problems:

- bypassing auth page sometimes just doesn't work, but header info is correct
- random crashes
- polling conflicts because backend is very slow

should really look for different options if it's serious
