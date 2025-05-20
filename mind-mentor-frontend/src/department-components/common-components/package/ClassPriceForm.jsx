import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  School,
  LocationOn,
  Add as AddIcon,
  Delete as DeleteIcon,
  Sync as SyncIcon,
  LocalShipping as KitIcon,
} from "@mui/icons-material";

import {  ToastContainer } from "react-toastify";

const ClassPriceForm = ({onClose,tabValue,handleTabChange,TabPanel,onlineClassPrices,ClassAmountRow,handleOnlineClassPriceChange,deleteOnlineClassPrice,programs,addOnlineClassPrice,handleSubmitOnlineClasses,loading,applyPhysicalToAll,setApplyPhysicalToAll,physicalClassPrices,existingCenters,centerPhysicalPrices,handleCenterPhysicalPriceChange,handlePhysicalClassPriceChange,addPhysicalClassPrice,deleteCenterPhysicalClassPrice,handleSubmitPhysicalClasses,addCenterPhysicalClassPrice,centerHybridPrices,handleSubmitCenterPhysicalPrices,applyHybridToAll,setApplyHybridToAll,hybridClassPrices,handleHybridClassPriceChange,deleteHybridClassPrice,handleSubmitHybridClasses,addHybridClassPrice,handleCenterHybridPriceChange,deleteCenterHybridClassPrice,addCenterHybridClassPrice,handleSubmitKitPrice,setKitPrice,kitPrice,setQuantity,handleSubmitCenterHybridPrices,quantity,deletePhysicalClassPrice }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Set Class Price
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="class type tabs"
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              label="Online Classes"
              id="class-tab-0"
              aria-controls="class-tabpanel-0"
              icon={<School />}
              iconPosition="start"
            />
            <Tab
              label="Physical Center Classes"
              id="class-tab-1"
              aria-controls="class-tabpanel-1"
              icon={<LocationOn />}
              iconPosition="start"
            />
            <Tab
              label="Hybrid Classes"
              id="class-tab-2"
              aria-controls="class-tabpanel-2"
              icon={<SyncIcon />}
              iconPosition="start"
            />
            <Tab
              label="Kit"
              id="class-tab-3"
              aria-controls="class-tabpanel-3"
              icon={<KitIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Online Classes Tab */}
        <TabPanel value={tabValue} index={0}>
          <Card elevation={1} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Online Class Pricing
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Set prices for different numbers of online classes (including
                GST)
              </Typography>
              <Divider sx={{ my: 2 }} />

              {/* Online Class-Amount Rows */}
              <Box sx={{ mt: 3 }}>
                {onlineClassPrices.map((price, index) => (
                  <ClassAmountRow
                    key={index}
                    index={index}
                    data={price}
                    onChange={handleOnlineClassPriceChange}
                    onDelete={deleteOnlineClassPrice}
                    disableDelete={onlineClassPrices.length === 1}
                    isHybrid={false} 
                    programs={programs}
                  />
                ))}

             
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addOnlineClassPrice}
                    variant="outlined"
                    size="small"
                  >
                    Add Price Point
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitOnlineClasses}
                    disabled={
                      loading ||
                      onlineClassPrices.some(
                        (p) =>
                          !p.classes ||
                          !p.amount ||
                          !p.program ||
                          !p.level ||
                          !p.time
                      )
                    }
                  >
                    {loading ? <CircularProgress size={24} /> : "Save Changes"}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" color="primary" gutterBottom>
                Physical Center Class Pricing
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={applyPhysicalToAll}
                    onChange={(e) => setApplyPhysicalToAll(e.target.checked)}
                    color="primary"
                  />
                }
                label="Apply to all centers"
              />
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Set pricing for physical center classes (including GST)
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {applyPhysicalToAll && (
              <Card elevation={1} sx={{ p: 2, borderRadius: 2, mb: 4 }}>
                <CardContent>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Common Pricing for All Centers
                  </Typography>

                  <Box sx={{ mt: 3 }}>
                    {physicalClassPrices.map((price, index) => (
                      <ClassAmountRow
                        key={index}
                        index={index}
                        data={price}
                        onChange={handlePhysicalClassPriceChange}
                        onDelete={handlePhysicalClassPriceChange}
                        disableDelete={physicalClassPrices.length === 1}
                        isHybrid={false}
                        programs={programs}
                      />
                    ))}

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2,
                      }}
                    >
                      <Button
                        startIcon={<AddIcon />}
                        onClick={addPhysicalClassPrice}
                        variant="outlined"
                        size="small"
                      >
                        Add Price Point
                      </Button>

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmitPhysicalClasses}
                        disabled={
                          loading ||
                          physicalClassPrices.some(
                            (p) =>
                              !p.classes ||
                              !p.amount ||
                              !p.program ||
                              !p.level ||
                              !p.time
                          )
                        }
                      >
                        {loading ? (
                          <CircularProgress size={24} />
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}

            <Typography variant="h6" color="primary" sx={{ mt: 2, mb: 2 }}>
              {applyPhysicalToAll ? "Centers" : "Center-Specific Pricing"}
            </Typography>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {existingCenters.length > 0 ? (
                  existingCenters.map((center) => (
                    <Grid item xs={12} key={center.id}>
                      <Card
                        elevation={1}
                        sx={{
                          borderRadius: 2,
                          transition: "all 0.3s",
                          "&:hover": {
                            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                          },
                        }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              flexWrap: "wrap",
                              gap: 2,
                              mb: 2,
                            }}
                          >
                            <Box>
                              <Typography
                                variant="h6"
                                sx={{ fontWeight: 500, mb: 0.5 }}
                              >
                                {center.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                                {center.location || "Location not specified"}
                              </Typography>
                            </Box>
                          </Box>

                          {!applyPhysicalToAll ? (
                            <>
                              <Divider sx={{ my: 2 }} />

                              {(
                                centerPhysicalPrices[center.id] || [
                                  ...physicalClassPrices,
                                ]
                              ).map((price, index) => (
                                <ClassAmountRow
                                  key={index}
                                  index={index}
                                  data={price}
                                  onChange={(idx, field, value) =>
                                    handleCenterPhysicalPriceChange(
                                      center.id,
                                      idx,
                                      field,
                                      value
                                    )
                                  }
                                  onDelete={(idx) =>
                                    deleteCenterPhysicalClassPrice(
                                      center.id,
                                      idx
                                    )
                                  }
                                  disableDelete={
                                    (
                                      centerPhysicalPrices[center.id] ||
                                      physicalClassPrices
                                    ).length === 1
                                  }
                                  isHybrid={false}
                                  programs={programs}
                                />
                              ))}

                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  mt: 2,
                                }}
                              >
                                <Button
                                  startIcon={<AddIcon />}
                                  onClick={() =>
                                    addCenterPhysicalClassPrice(center.id)
                                  }
                                  variant="outlined"
                                  size="small"
                                >
                                  Add Price Point
                                </Button>

                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() =>
                                    handleSubmitCenterPhysicalPrices(center.id)
                                  }
                                  disabled={
                                    loading ||
                                    (
                                      centerPhysicalPrices[center.id] ||
                                      physicalClassPrices
                                    ).some(
                                      (p) =>
                                        !p.classes ||
                                        !p.amount ||
                                        !p.program ||
                                        !p.level ||
                                        !p.time
                                    )
                                  }
                                  size="medium"
                                >
                                  {loading ? (
                                    <CircularProgress size={20} />
                                  ) : (
                                    "Save"
                                  )}
                                </Button>
                              </Box>
                            </>
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                mt: 2,
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Using common pricing settings
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Alert
                      severity="info"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    >
                      No physical centers found. Please add physical centers
                      first to set pricing.
                    </Alert>
                  </Grid>
                )}
              </Grid>
            )}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Card elevation={1} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" color="primary" gutterBottom>
                  Hybrid Class Pricing
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={applyHybridToAll}
                      onChange={(e) => setApplyHybridToAll(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Apply to all centers"
                />
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Set prices for different numbers of hybrid classes (including
                GST)
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ mt: 3 }}>
                {hybridClassPrices.map((price, index) => (
                  <ClassAmountRow
                    key={index}
                    index={index}
                    data={price}
                    onChange={handleHybridClassPriceChange}
                    onDelete={deleteHybridClassPrice}
                    disableDelete={hybridClassPrices.length === 1}
                    isHybrid={true}
                    programs={programs}
                  />
                ))}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addHybridClassPrice}
                    variant="outlined"
                    size="small"
                  >
                    Add Price Point
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitHybridClasses}
                    disabled={
                      loading ||
                      hybridClassPrices.some(
                        (p) =>
                          !p.classes ||
                          !p.amount ||
                          !p.program ||
                          !p.level ||
                          !p.time
                      )
                    }
                  >
                    {loading ? <CircularProgress size={24} /> : "Save Changes"}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {!applyHybridToAll && (
            <>
              <Typography variant="h6" color="primary" sx={{ mt: 4, mb: 2 }}>
                Center-Specific Hybrid Pricing
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {existingCenters.length > 0 ? (
                    existingCenters.map((center) => (
                      <Grid item xs={12} key={center.id}>
                        <Card
                          elevation={1}
                          sx={{
                            borderRadius: 2,
                            transition: "all 0.3s",
                            "&:hover": {
                              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                            },
                          }}
                        >
                          <CardContent>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: 500, mb: 0.5 }}
                            >
                              {center.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 2,
                              }}
                            >
                              <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                              {center.location || "Location not specified"}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            {(
                              centerHybridPrices[center.id] || [
                                ...hybridClassPrices,
                              ]
                            ).map((price, index) => (
                              <ClassAmountRow
                                key={index}
                                index={index}
                                data={price}
                                onChange={(idx, field, value) =>
                                  handleCenterHybridPriceChange(
                                    center.id,
                                    idx,
                                    field,
                                    value
                                  )
                                }
                                onDelete={(idx) =>
                                  deleteCenterHybridClassPrice(center.id, idx)
                                }
                                disableDelete={
                                  (
                                    centerHybridPrices[center.id] ||
                                    hybridClassPrices
                                  ).length === 1
                                }
                                isHybrid={true}
                                programs={programs}
                              />
                            ))}

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mt: 2,
                              }}
                            >
                              <Button
                                startIcon={<AddIcon />}
                                onClick={() =>
                                  addCenterHybridClassPrice(center.id)
                                }
                                variant="outlined"
                                size="small"
                              >
                                Add Price Point
                              </Button>

                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                  handleSubmitCenterHybridPrices(center.id)
                                }
                                disabled={
                                  loading ||
                                  (
                                    centerHybridPrices[center.id] ||
                                    hybridClassPrices
                                  ).some(
                                    (p) =>
                                      !p.classes ||
                                      !p.amount ||
                                      !p.program ||
                                      !p.level ||
                                      !p.time
                                  )
                                }
                                size="medium"
                              >
                                {loading ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  "Save"
                                )}
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Alert
                        severity="info"
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                      >
                        No physical centers found. Please add physical centers
                        first to set pricing.
                      </Alert>
                    </Grid>
                  )}
                </Grid>
              )}
            </>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Card elevation={1} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Kit Pricing
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Set the price for the kit (including GST)
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
                <TextField
                  label="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  sx={{ width: 250, mr: 2 }}
                  variant="outlined"
                />
                <TextField
                  label="Kit Price"
                  type="number"
                  value={kitPrice}
                  onChange={(e) => setKitPrice(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                  sx={{ width: 250, mr: 2 }}
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitKitPrice}
                  disabled={loading || !kitPrice}
                  sx={{ height: 56 }}
                >
                  {loading ? <CircularProgress size={24} /> : "Save Changes"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" color="primary">
          Close
        </Button>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
};

export default ClassPriceForm;
