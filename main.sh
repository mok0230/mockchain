#!/usr/bin/env bash

set -x

echo 'Starting Mockchain Miner'

read -p 'Enter number of miners (1-10): ' num_miners

if [ -z "$num_miners" ]
then
  echo 'Error! Input cannot be blank'
  exit 1
fi

if ! [[ "$num_miners" =~ ^[+-]?[0-9]+\.?[0-9]*$ ]]
then
  echo "Error! Input must be a number"
  exit 1
fi

if [[ "$num_miners" -lt 1 ]] || [[ "$num_miners" -gt 10 ]]
then
  echo "Error! Input must be between 1 and 10 (inclusive)"
  exit 1
fi

trap "exit" INT TERM ERR
trap "kill 0" EXIT

# start logger process
node logger/server.js &

peers=("3001")

for i in $(seq "$num_miners")
  do
  if [[ $i == "1" ]]
  then
    echo "1 is special"
    node miner/server.js --port 3001 &
  else
    echo "Number $i is not"
    echo "Peers: $peers"
    port=$((3000 + $i))
    peers_args=""
    for peer in "${peers[@]}";
    do
      peers_args+=" --peers $peer"
    done
    echo "zzz"
    node miner/server.js --port "$port" $peers_args &
    peers+=("$port")
  fi
done

sleep 3 ; open client/index.html

wait
