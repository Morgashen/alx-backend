#!/usr/bin/env python3
"""
LFUCache module
Implements a caching system based on the LFU (Least Frequently Used) algorithm.
Falls back on LRU (Least Recently Used) when frequencies match.
"""

from base_caching import BaseCaching

class LFUCache(BaseCaching):
    """
    LFUCache class that inherits from BaseCaching and provides a caching system
    which evicts the least frequently used items first, then least recently used
    if frequencies match.
    """

    def __init__(self):
        """Initialize LFUCache with cache and frequency tracking."""
        super().__init__()
        self.frequency = {}  # Track frequency of each key
        self.usage = []      # Track usage order for LRU fallback

    def put(self, key, item):
        """
        Add an item to the cache using the LFU algorithm.
        If key or item is None, does nothing.
        Evicts least frequently used item if cache exceeds MAX_ITEMS.
        """
        if key is None or item is None:
            return

        if key in self.cache_data:
            self.cache_data[key] = item
            self.frequency[key] += 1
            self.usage.remove(key)
            self.usage.append(key)
        else:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                self._evict()
            self.cache_data[key] = item
            self.frequency[key] = 1
            self.usage.append(key)

    def get(self, key):
        """
        Retrieve an item by key. Returns None if key doesn't exist.
        """
        if key is None or key not in self.cache_data:
            return None
        self.frequency[key] += 1
        self.usage.remove(key)
        self.usage.append(key)
        return self.cache_data[key]

    def _evict(self):
        """Evict the least frequently used item, using LRU as a tiebreaker."""
        least_freq = min(self.frequency.values())
        lfu_keys = [k for k, v in self.frequency.items() if v == least_freq]
        if len(lfu_keys) > 1:
            # Resolve tie by using the least recently used
            lru_key = next(k for k in self.usage if k in lfu_keys)
        else:
            lru_key = lfu_keys[0]

        del self.cache_data[lru_key]
        del self.frequency[lru_key]
        self.usage.remove(lru_key)
        print(f"DISCARD: {lru_key}")
