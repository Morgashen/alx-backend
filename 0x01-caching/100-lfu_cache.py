#!/usr/bin/env python3
"""
Implements a Least Frequently Used (LFU) cache with a Least Recently Used (LRU) eviction policy.
"""

from collections import OrderedDict

class BaseCaching:
    """
    Base class for caching systems
    """
    MAX_ITEMS = 4

class LFUCache(BaseCaching):
    """
    A caching system that follows the Least Frequently Used (LFU) eviction policy
    with a Least Recently Used (LRU) tie-breaking strategy.
    """

    def __init__(self):
        """
        Initialize the cache.
        """
        super().__init__()
        self.cache_data = {}
        self.frequency = {}
        self.lru = OrderedDict()

    def put(self, key, item):
        """
        Add an item in the cache.
        """
        if key is None or item is None:
            return

        # If key already exists, update its value and frequency
        if key in self.cache_data:
            self.cache_data[key] = item
            self.frequency[key] += 1
            self.lru.move_to_end(key)
            return

        # If cache is full, evict the least frequently used item
        if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
            least_frequent = min(self.frequency, key=self.frequency.get)
            if len([k for k, v in self.frequency.items() if v == self.frequency[least_frequent]]) > 1:
                # If there are multiple items with the same frequency, evict the least recently used
                least_recent = next(iter(self.lru))
                del self.cache_data[least_recent]
                del self.frequency[least_recent]
                self.lru.pop(least_recent)
                print(f"DISCARD: {least_recent}")
            else:
                # Evict the least frequently used item
                del self.cache_data[least_frequent]
                del self.frequency[least_frequent]
                self.lru.pop(least_frequent)
                print(f"DISCARD: {least_frequent}")

        # Add the new item to the cache
        self.cache_data[key] = item
        self.frequency[key] = 1
        self.lru[key] = None

    def get(self, key):
        """
        Retrieve an item by key.
        """
        if key is None or key not in self.cache_data:
            return None

        self.frequency[key] += 1
        self.lru.move_to_end(key)
        return self.cache_data[key]

    def print_cache(self):
        """
        Print the current state of the cache.
        """
        print(self.cache_data)
