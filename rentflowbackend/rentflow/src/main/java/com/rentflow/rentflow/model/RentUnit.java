package com.rentflow.rentflow.model;

import jakarta.persistence.*;

@Entity
@Table(name = "units")
public class RentUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String unitNumber; // e.g "101", "A2", "Ground Floor"

    private String description;

    @Column(nullable = false)
    private Double rentAmount;

    @Column(unique = true)
    private String inviteCode;

    @Enumerated(EnumType.STRING)
    private UnitStatus status; // VACANT or OCCUPIED

    @ManyToOne
    @JoinColumn(name = "property_id")
    private Property property;

    @OneToOne
    @JoinColumn(name = "tenant_id")
    private User tenant; // only one tenant per unit

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUnitNumber() { return unitNumber; }
    public void setUnitNumber(String unitNumber) { this.unitNumber = unitNumber; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getRentAmount() { return rentAmount; }
    public void setRentAmount(Double rentAmount) { this.rentAmount = rentAmount; }

    public String getInviteCode() { return inviteCode; }
    public void setInviteCode(String inviteCode) { this.inviteCode = inviteCode; }

    public UnitStatus getStatus() { return status; }
    public void setStatus(UnitStatus status) { this.status = status; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public User getTenant() { return tenant; }
    public void setTenant(User tenant) { this.tenant = tenant; }
    private String paystackAuthCode; // saved after first payment
    private String paystackEmail;    // tenant email for charging
    private Integer rentDueDay;      // e.g 1 = 1st of every month

    public String getPaystackAuthCode() { return paystackAuthCode; }
    public void setPaystackAuthCode(String paystackAuthCode) { this.paystackAuthCode = paystackAuthCode; }

    public String getPaystackEmail() { return paystackEmail; }
    public void setPaystackEmail(String paystackEmail) { this.paystackEmail = paystackEmail; }

    public Integer getRentDueDay() { return rentDueDay; }
    public void setRentDueDay(Integer rentDueDay) { this.rentDueDay = rentDueDay; }
}