from collections import defaultdict
from datetime import date
from typing import Any

import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

from app.models import Customer


def run_segmentation(customers: list[Customer]) -> dict[str, Any]:
    if not customers:
        return {
            "algorithm": "k-means",
            "clusters": [],
            "total_customers": 0,
        }

    if len(customers) == 1:
        customer = customers[0]

        return {
            "algorithm": "k-means",
            "clusters": [
                {
                    "cluster_id": 0,
                    "persona": "New Customer Group",
                    "customers": 1,
                    "revenue": customer.purchase_amount or 0,
                    "revenue_share": 100,
                    "average_frequency": customer.purchase_frequency or 0,
                    "average_recency_days": calculate_recency(customer),
                }
            ],
            "total_customers": 1,
        }

    features = []

    for customer in customers:
        features.append(
            [
                calculate_recency(customer),
                customer.purchase_frequency or 0,
                customer.purchase_amount or 0,
            ]
        )

    feature_matrix = np.array(features, dtype=float)

    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(feature_matrix)

    cluster_count = min(4, len(customers))

    model = KMeans(
        n_clusters=cluster_count,
        n_init=10,
        random_state=42,
    )

    labels = model.fit_predict(scaled_features)

    grouped_customers = defaultdict(list)

    for customer, label in zip(customers, labels):
        grouped_customers[int(label)].append(customer)

    total_revenue = sum(
        customer.purchase_amount or 0
        for customer in customers
    )

    cluster_stats = {}

    for cluster_id, cluster_customers in grouped_customers.items():
        cluster_revenue = sum(
            customer.purchase_amount or 0
            for customer in cluster_customers
        )

        cluster_stats[cluster_id] = {
            "customers": cluster_customers,
            "revenue": cluster_revenue,
            "average_frequency": sum(
                customer.purchase_frequency or 0
                for customer in cluster_customers
            ) / len(cluster_customers),
            "average_recency_days": sum(
                calculate_recency(customer)
                for customer in cluster_customers
            ) / len(cluster_customers),
        }

    personas = assign_personas(cluster_stats)

    clusters = []

    for cluster_id, stats in cluster_stats.items():
        revenue_share = 0

        if total_revenue > 0:
            revenue_share = round(
                (stats["revenue"] / total_revenue) * 100,
                2,
            )

        clusters.append(
            {
                "cluster_id": cluster_id,
                "persona": personas[cluster_id],
                "customers": len(stats["customers"]),
                "revenue": round(stats["revenue"], 2),
                "revenue_share": revenue_share,
                "average_frequency": round(
                    stats["average_frequency"],
                    2,
                ),
                "average_recency_days": round(
                    stats["average_recency_days"],
                    2,
                ),
            }
        )

    clusters.sort(
        key=lambda cluster: cluster["revenue"],
        reverse=True,
    )

    return {
        "algorithm": "k-means",
        "features": [
            "recency",
            "purchase_frequency",
            "purchase_amount",
        ],
        "cluster_count": cluster_count,
        "total_customers": len(customers),
        "clusters": clusters,
    }


def calculate_recency(customer: Customer) -> int:
    if not customer.last_purchase_date:
        return 120

    return max(
        (date.today() - customer.last_purchase_date).days,
        0,
    )


def assign_personas(cluster_stats: dict[int, dict]) -> dict[int, str]:
    available_clusters = set(cluster_stats.keys())
    personas = {}

    highest_revenue_cluster = max(
        available_clusters,
        key=lambda cluster_id: cluster_stats[cluster_id]["revenue"],
    )

    personas[highest_revenue_cluster] = "High Value Customers"
    available_clusters.remove(highest_revenue_cluster)

    if available_clusters:
        highest_recency_cluster = max(
            available_clusters,
            key=lambda cluster_id: cluster_stats[cluster_id][
                "average_recency_days"
            ],
        )

        personas[highest_recency_cluster] = "At-Risk Customers"
        available_clusters.remove(highest_recency_cluster)

    if available_clusters:
        highest_frequency_cluster = max(
            available_clusters,
            key=lambda cluster_id: cluster_stats[cluster_id][
                "average_frequency"
            ],
        )

        personas[highest_frequency_cluster] = "Loyal Repeat Buyers"
        available_clusters.remove(highest_frequency_cluster)

    for cluster_id in available_clusters:
        personas[cluster_id] = "Discount Hunters"

    return personas